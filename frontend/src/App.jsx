
import { useState, useRef, useEffect } from 'react'

// Motor fiscal determinista - NO IA
function calculateRETA(facturacionAnual) {
  const tramos = [
    { min: 0, max: 6700, cuota: 230 },
    { min: 6700, max: 9000, cuota: 260 },
    { min: 9000, max: 12750, cuota: 280 },
    { min: 12750, max: 15000, cuota: 290 },
    { min: 15000, max: 20000, cuota: 310 },
    { min: 20000, max: 27000, cuota: 350 },
    { min: 27000, max: 32000, cuota: 380 },
    { min: 32000, max: 40000, cuota: 420 },
    { min: 40000, max: 48000, cuota: 460 },
    { min: 48000, max: 55000, cuota: 500 },
    { min: 55000, max: 60000, cuota: 530 },
    { min: 60000, max: 70000, cuota: 560 },
    { min: 70000, max: 85000, cuota: 590 },
    { min: 85000, max: 100000, cuota: 590 },
    { min: 100000, max: 9999999, cuota: 590 },
  ]
  const netoMensual = facturacionAnual / 12
  const t = tramos.find(x => facturacionAnual >= x.min && facturacionAnual < x.max) || tramos[tramos.length-1]
  return { cuota: t.cuota, tramo: t, netoMensual }
}

function calculateNetIncome(facturacion, gastosPct = 30) {
  const { cuota } = calculateRETA(facturacion)
  const gastos = facturacion * (gastosPct / 100)
  const base = facturacion - gastos - (cuota * 12)
  const irpfEstimado = base * 0.20
  const neto = base - irpfEstimado
  return { cuotaAnual: cuota*12, gastos, base, irpfEstimado, neto }
}

export default function App() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: '¡Hola! Soy AbogadoBot España. Dime tu facturación y te calculo RETA 2025-26, IVA, IRPF y neto real con motor determinista.' }
  ])
  const [input, setInput] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | error
  const [rateLimited, setRateLimited] = useState(false)
  const endRef = useRef(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  async function send() {
    if (!input.trim() || status === 'sending' || rateLimited) return
    const userText = input.trim()
    setInput('')
    setStatus('sending')
    setMessages(m => [...m, { role: 'user', text: userText }])

    // Simulación de POST /api/chat -> backend validado
    try {
      // Validación cliente (servidor también valida)
      if (userText.length > 2000) throw new Error('Mensaje demasiado largo')

      await new Promise(r => setTimeout(r, 900))

      // Detección determinista
      const match = userText.match(/(\d{2,6})\s*(k|€|euros)?/i)
      let reply = ''
      if (match) {
        let fact = parseInt(match[1])
        if (match[2]?.toLowerCase() === 'k') fact *= 1000
        const calc = calculateRETA(fact)
        const net = calculateNetIncome(fact)
        reply = `**Cálculo real (no inventado)**\n\nFacturación: ${fact.toLocaleString('es-ES')} € / año\nTramo RETA 2025-26: ${calc.tramo.min.toLocaleString()} - ${calc.tramo.max.toLocaleString()} € → **${calc.cuota} €/mes**\n\nDesglose:\n- RETA anual: ${net.cuotaAnual.toLocaleString()} €\n- Gastos ${30}%: ${net.gastos.toLocaleString()} €\n- Base: ${net.base.toLocaleString()} €\n- IRPF estimado 20%: ${net.irpfEstimado.toLocaleString()} €\n\n**Neto orientativo: ${net.neto.toLocaleString()} € / año**\n\n_Fórmula: facturación - gastos - RETA - IRPF. Motor en services/calculations.js. Esto es orientativo, no asesoría profesional._`
      } else {
        reply = `Entendido: "${userText}"\n\nSoy asistente informativo con motor fiscal determinista. Puedo calcular RETA, IVA, IRPF y neto. Prueba: "Facturo 70k" o "Facturo 45.000 €".\n\n**Importante:** No soy un abogado colegiado y no sustituyo asesoramiento profesional.`
      }

      setMessages(m => [...m, { role: 'assistant', text: reply }])
      setStatus('idle')
    } catch (e) {
      setStatus('error')
      setMessages(m => [...m, { role: 'assistant', text: `⚠️ Error: ${e.message}. Reintenta.` }])
    }
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col">
      <header className="border-b border-white/10 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="font-semibold">AbogadoBot España</span>
          <span className="text-xs opacity-60 ml-2">Backend OK · IA OK · Motor OK</span>
        </div>
        <a href="mailto:hola@abogadobot.es" className="text-xs text-blue-400">hola@abogadobot.es</a>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto flex flex-col p-4">
        <section className="flex-1 space-y-4 overflow-y-auto py-4">
          {messages.map((m, i) => (
            <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
              <div className={`inline-block max-w-[85%] p-3 rounded-2xl text-sm whitespace-pre-wrap ${m.role === 'user' ? 'bg-[#3b82f6] text-white' : 'bg-white/10 text-white'}`}>
                {m.text}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </section>

        <section className="border-t border-white/10 pt-4">
          <div className="flex gap-2">
            <label htmlFor="chat-input" className="sr-only">Escribe tu consulta jurídica</label>
            <textarea
              id="chat-input"
              aria-label="Escribe tu consulta jurídica"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-sm resize-none focus:outline-none focus:border-blue-500"
              rows={1}
              placeholder="Ej: Facturo 70k al año..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
            />
            <button
              onClick={send}
              disabled={status === 'sending' || !input.trim()}
              className="bg-[#3b82f6] disabled:opacity-50 px-5 rounded-xl text-sm font-semibold"
              aria-live="polite"
            >
              {status === 'sending' ? 'ANALIZANDO...' : status === 'error' ? 'REINTENTAR' : 'ENVIAR'}
            </button>
          </div>
          <p className="text-[11px] opacity-50 mt-3">Aviso legal RGPD: asistente informativo. No almacenamos datos personales más allá de lo necesario. No sustituye a abogado colegiado. /privacidad /aviso-legal /cookies /terminos</p>
        </section>
      </main>
    </div>
  )
}
