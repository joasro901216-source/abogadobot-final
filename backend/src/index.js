import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

app.get('/health', (req,res)=> res.json({status:'ok', ai:true, ts: new Date().toISOString()}));
app.get('/', (req,res)=> res.send('AbogadoBot Backend IA REAL - GROQ FREE'));

app.post('/api/chat', async (req,res)=>{
  try{
    const { message, isPremium, freeUsed } = req.body;
    const preguntaNum = freeUsed || 0;

    let system = `Eres AbogadoBot Gandía. Responde REAL, específico, no genérico.
Da IAE exacto, Modelo 037 casillas reales, RETA 2026, seguros, carnets.
Si es electricista: IAE 504.1, REBT 842/2002, carnet BT, RC 300k, PRL 20h.
Si es pintor: IAE 505.3, furgoneta deducible 100%.
Si es Gandía: oficina SUMA, código postal.
IMPORTANTE: Esta es la pregunta ${preguntaNum+1}. Si preguntaNum >=2 y isPremium=false, responde corto y di: 🔒 Has gastado tus 2 consultas gratis.`;

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{role:"system", content: system},{role:"user", content: message}],
        max_tokens: 800,
        temperature: 0.6
      })
    });

    const completion = await groqRes.json();

    if(completion.error){
      throw new Error(completion.error.message);
    }

    let reply = completion.choices[0].message.content;
    const needPay = preguntaNum >= 2 &&!isPremium;
    if(needPay) reply += `\n\n🔒 Has gastado tus 2 consultas gratis. Para PDF del Modelo 037 relleno, cálculo RETA y chat ilimitado, paga Premium 9.99€: paypal.me/AbogadoBotES/9.99EUR`;

    return res.json({ reply, needPay, ai:true });

  }catch(e){
    console.error(e);
    res.status(500).json({ reply:"Error Groq: "+e.message+" Verifica tu GROQ_API_KEY en Render Environment", needPay:false, ai:false });
  }
});

app.post('/api/verify-paypal', (req,res)=> res.json({ ok:true, premiumCode:'PREM-'+Date.now() }));

app.listen(PORT,'0.0.0.0',()=> console.log('Backend IA REAL con freemium 2 gratis + GROQ FREE en '+PORT));
