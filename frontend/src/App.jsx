import { useState } from 'react'

function App() {
  const [facturacion, setFacturacion] = useState('')
  const [resultado, setResultado] = useState(null)

  const calcular = () => {
    const f = parseFloat(facturacion.replace('k','000')) || 0
    if(f < 100) { setResultado('Escribe una facturación válida, ej: 70000'); return; }

    let retaMes = 230
    if(f > 6700 && f <= 15000) retaMes = 294
    else if(f > 15000 && f <= 30000) retaMes = 350
    else if(f > 30000 && f <= 50000) retaMes = 425
    else if(f > 50000) retaMes = 530

    const retaAnual = retaMes * 12
    const gastos = f * 0.3
    const base = f - gastos - retaAnual
    const irpf = base * 0.20
    const neto = base - irpf

    setResultado(`
      Facturación: ${f.toLocaleString()} €/año
      Tramo RETA 2025-26: ${retaMes} €/mes
      RETA anual: ${retaAnual.toLocaleString()} €
      Gastos 30%: ${gastos.toLocaleString()} €
      Base: ${base.toLocaleString()} €
      IRPF 20%: ${irpf.toLocaleString()} €
      NETO: ${neto.toLocaleString()} €/año
    `)
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white flex flex-col items-center p-4">
      <div className="w-full max-w-2xl mt-10">
        <div className="bg-[#1a2332] rounded-2xl p-6 border border-[#2a3a52] shadow-2xl">
          <h1 className="text-3xl font-bold text-center mb-2">⚖️ AbogadoBot España</h1>
          <p className="text-center text-slate-400 mb-6 text-sm">RETA 2025-26 · IVA · IRPF · Neto Real · Motor Determinista</p>

          <div className="bg-[#0f172a] p-4 rounded-xl mb-4 border border-[#1e293b]">
            <p className="text-emerald-400 text-sm">¡Hola! Soy tu asistente. Dime tu facturación anual.</p>
            {resultado && <pre className="whitespace-pre-wrap mt-3 text-sm text-slate-200 leading-6">{resultado}</pre>}
          </div>

          <div className="flex gap-2">
            <input
              value={facturacion}
              onChange={e=>setFacturacion(e.target.value)}
              placeholder="Ej: 70000"
              className="flex-1 bg-[#0f172a] border border-[#2a3a52] rounded-xl px-4 py-3 outline-none focus:border-blue-500"
            />
            <button onClick={calcular} className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl font-bold">ENVIAR</button>
          </div>
        </div>
        <p className="text-center text-[11px] text-slate-500 mt-4">Aviso RGPD: asistente informativo. No sustituye abogado colegiado.</p>
      </div>
    </div>
  )
}
export default App
