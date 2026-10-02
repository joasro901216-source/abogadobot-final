import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import chatRoutes from './routes/chat.js';
import billingRoutes from './routes/billing.js';
import authRoutes from './routes/auth.js';
import stripeRoutes from './routes/stripe.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Stripe webhook necesita raw body ANTES de json()
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }), stripeRoutes);

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json({ limit: '1mb' }));

app.use(rateLimit({ windowMs: 60*1000, max: 60 }));

// Health
app.get('/api/health', (req,res) => {
  res.json({ ok: true, version: '2.0.0', time: new Date().toISOString() });
});

app.use('/api/chat', chatRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/stripe', stripeRoutes);

app.use((req,res) => res.status(404).json({ error: 'Not found' }));

app.listen(PORT, () => {
  console.log(`[AbogadoBot] Backend escuchando en :${PORT}`);
});
