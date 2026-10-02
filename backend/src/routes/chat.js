import { Router } from 'express';
import OpenAI from 'openai';

const router = Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Motor RETA - Reglamento Extranjero
function calcularRETA({ aniosResidencia, ingresos, contrato, arraigo }) {
  let score = 0;
  const detalles = [];
  
  if (aniosResidencia >= 2) { score += 30; detalles.push("Residencia 2+ años: +30"); }
  else if (aniosResidencia >= 1) { score += 15; detalles.push("Residencia 1 año: +15"); }
  
  if (contrato === 'indefinido') { score += 25; detalles.push("Contrato indefinido: +25"); }
  else if (contrato === 'temporal') { score += 10; detalles.push("Contrato temporal: +10"); }
  
  if (ingresos >= 15000) { score += 20; detalles.push("Ingresos suficientes: +20"); }
  
  if (arraigo) { score += 25; detalles.push("Arraigo demostrado: +25"); }

  let viabilidad = 'BAJA';
  if (score >= 80) viabilidad = 'ALTA';
  else if (score >= 50) viabilidad = 'MEDIA';

  return { score, viabilidad, detalles };
}

router.post('/', async (req,res) => {
  try {
    const { message, contexto } = req.body;
    if (!message) return res.status(400).json({ error: 'message requerido' });

    // Calcular RETA si vienen datos
    let reta = null;
    if (contexto?.aniosResidencia !== undefined) {
      reta = calcularRETA(contexto);
    }

    const systemPrompt = `Eres AbogadoBot, experto en extranjería España.
Reglas:
- Responde claro, en español.
- Si RETA score < 50, explica qué falta.
- Siempre añade disclaimer: no es asesoría legal vinculante.
Contexto RETA: ${JSON.stringify(reta)}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      temperature: 0.4
    });

    res.json({
      reply: completion.choices[0].message.content,
      reta,
      usage: completion.usage
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error IA', details: e.message });
  }
});

export default router;
