import { Router } from 'express';
const router = Router();

// Middleware JWT simple (demo)
function auth(req,res,next){
  const token = req.headers.authorization?.replace('Bearer ','');
  if(!token) return res.status(401).json({error:'No token'});
  next();
}

router.get('/plans', (req,res) => {
  res.json([
    { id: 'free', name: 'Gratis', consultas: 3, price: 0 },
    { id: 'pro', name: 'Pro', consultas: 100, price: 9.99, stripePriceId: process.env.STRIPE_PRICE_ID }
  ]);
});

router.get('/me', auth, async (req,res) => {
  // Aquí consultarías PG: SELECT * FROM subscriptions WHERE user_id
  res.json({ plan: 'free', consultas_usadas: 1, limite: 3 });
});

export default router;
