import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// Conexión OpenAI
const openai = process.env.OPENAI_API_KEY? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
console.log('OpenAI conectado:',!!openai);

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'abogadobot-backend',
    ai:!!openai,
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.send('AbogadoBot Backend REAL + OpenAI Live - Gandia');
});

app.post('/api/chat', async (req, res) => {
  try {
    const message = req.body.message || '';
    const isPremium = req.body.isPremium || false;

    if (openai) {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `Eres AbogadoBot Gandía, experto en alta de autónomos en España 2026. Responde siempre en español.

Da: IAE exacto, Modelo 036/037 con casillas, RETA 80€ primer año, seguros obligatorios, si necesita carnet.
- Pintor: IAE 505.3, furgoneta 100% deducible, RC 180€/año
- Electricista: IAE 504.1, Carnet Instalador BT REBT 842/2002, Seguro RC 300.000€, PRL 20h
- Fontanero: IAE 504.2

Responde corto con ✅. Si isPremium=false, termina con: 🔒 Desbloquea Premium 9,99€ para Modelo 037 relleno y PDF. Si isPremium=true, da el Modelo 037 relleno completo.`
          },
          {
            role: "user",
            content: `Consulta: ${message} | ¿Es premium?: ${isPremium}`
          }
        ],
        max_tokens: 700,
        temperature: 0.7
      });

      return res.json({
        reply: completion.choices[0].message.content,
        premium: isPremium,
        ai: true
      });
    }

    // Fallback sin llave
    let reply = `Caso: ${message}\n\n✅ IAE correspondiente\n✅ Alta Modelo 037 en Hacienda\n✅ RETA 80€/mes primer año`;
    const m = message.toLowerCase();
    if (m.includes('electr')) reply = `Electricista Autónomo Gandía:\n✅ IAE 504.1 Instalaciones eléctricas\n✅ Modelo 037: 504.1 + 505.7 reformas\n✅ RETA 80€/mes\n✅ Carnet Instalador BT + Seguro RC 300.000€\n✅ Curso PRL 20h`;
    if (m.includes('pintor')) reply = `Pintor Autónomo:\n✅ IAE 505.3 Pintura\n✅ Modelo 037\n✅ RETA 80€/mes\n✅ Furgoneta 100% deducible\n✅ Seguro RC 180€/año`;

    if (!isPremium) reply += '\n\n🔒 Desbloquea Premium 9,99€ para ver Modelo 037 relleno y PDF descargable';

    res.json({ reply, premium: isPremium, ai: false });

  } catch (e) {
    console.error(e);
    res.status(500).json({ reply: 'Error IA: ' + e.message });
  }
});

app.post('/api/verify-paypal', (req, res) => {
  res.json({ ok: true, premiumCode: 'PREM-' + Date.now() });
});

app.listen(PORT, '0.0.0.0', () => console.log('Backend REAL + OpenAI en ' + PORT));
