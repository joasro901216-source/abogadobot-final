import express from 'express';
import cors from 'cors';
const app = express();
const PORT = process.env.PORT || 10000;
app.use(cors());
app.use(express.json());

app.get('/health', (req,res)=>{
  res.json({status:'ok', service:'abogadobot-backend', timestamp: new Date().toISOString()});
});
app.get('/', (req,res)=> res.send('AbogadoBot Backend REAL Live - Gandia'));
app.post('/api/chat', (req,res)=>{
  const msg = (req.body.message||'').toLowerCase();
  let reply = 'IAE general - Modelo 036';
  if(msg.includes('pintor')) reply = 'PINTOR IAE 505.3 - Modelo 037 - RETA 80€/mes - Seguro RC 180€/año - Deducible furgoneta';
  if(msg.includes('abogad')) reply = 'ABOGADO IAE 731 - Mutualidad o RETA - Colegio Abogados';
  res.json({reply, premium: req.body.isPremium});
});
app.post('/api/verify-paypal', (req,res)=> res.json({ok:true, premiumCode:'PREM-'+Date.now()}));

app.listen(PORT, '0.0.0.0', ()=> console.log('Backend REAL Live en '+PORT));
