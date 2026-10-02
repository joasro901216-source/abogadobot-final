import { Router } from 'express';
import Stripe from 'stripe';

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/create-checkout', async (req,res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      success_url: `${process.env.FRONTEND_URL}/?success=1`,
      cancel_url: `${process.env.FRONTEND_URL}/?canceled=1`
    });
    res.json({ url: session.url });
  } catch(e){
    res.status(500).json({ error: e.message });
  }
});

router.post('/webhook', async (req,res) => {
  const sig = req.headers['stripe-signature'];
  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    console.log('[Stripe] Event:', event.type);
    // TODO: actualizar DB según event.type
    res.json({ received: true });
  } catch(e){
    console.error(e.message);
    res.status(400).send(`Webhook Error: ${e.message}`);
  }
});

export default router;
