import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';

const app = express();
const PORT = process.env.PORT || 10000;
app.use(cors());
app.use(express.json());

const openai = process.env.OPENAI_API_KEY? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

app.get('/health', (req,res)=> res.json({status:'ok', ai:!!openai, ts: new Date().toISOString()}));
app.get('/', (req,res)=> res.send('AbogadoBot Backend IA REAL'));

app.post('/api/chat', async (req,res)=>{
  try{
    const { message, isPremium, freeUsed } = req.body; // freeUsed viene del frontend
    const preguntaNum = freeUsed || 0;

    let system = `Eres AbogadoBot Gandía. Responde REAL, específico, no genérico.
Da IAE exacto, Modelo 037 casillas reales, RETA 2026, seguros, carnets.
Si es electricista: IAE 504.1, REBT 842/2002, carnet BT, RC 300k, PRL 20h.
Si es pintor: IAE 505.3, furgoneta deducible 100%.

IMPORTANTE: Esta es la pregunta ${preguntaNum+1}. Si preguntaNum >=2 y isPremium=false, responde corto y di: '⚠️ Has usado tus 2 consultas gratis. Desbloquea Premium 9,99€ para seguir y generar PDFs.' Si isPremium=true o preguntaNum<2, da respuesta completa y técnica.`;

    if(openai){
      const completion = await openai.chat.completions.create({
        model:"gpt-4o-mini",
        messages:[{role:"system", content: system},{role:"user", content: message}],
        max_tokens:800,
        temperature:0.6
      });
      let reply = completion.choices[0].message.content;
      const needPay = preguntaNum >= 2 && !isPremium;
      if(needPay) reply += "\n\n🔒 Has gastado tus 2 consultas gratis. Para PDF del Modelo 037 relleno, cálculo RETA y checklist PRL → Desbloquea Premium 9,99€";
      return res.json({ reply, needPay, ai:true });
    }
    // fallback por si falla OpenAI
    res.json({ reply:`${message}\n\n✅ IAE 504.1 electricista\n✅ Modelo 037\n✅ RETA 80€`, needPay:false, ai:false });
  }catch(e){
    console.error(e);
    res.status(500).json({ reply:"Error OpenAI: "+e.message+" Verifica tu crédito en platform.openai.com", needPay:false });
  }
});

app.post('/api/verify-paypal', (req,res)=> res.json({ ok:true, premiumCode:'PREM-'+Date.now() }));
app.listen(PORT,'0.0.0.0',()=> console.log('Backend IA REAL con freemium 2 gratis en '+PORT));
