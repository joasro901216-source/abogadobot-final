import { useState } from 'react'

export default function App(){
  const [input,setInput]=useState('')
  const [res,setRes]=useState(null)

  const calc=()=>{
    let txt=input.replace(/[^0-9kK]/g,'').toLowerCase()
    let f=0
    if(txt.includes('k')) f=parseFloat(txt)*1000
    else f=parseFloat(txt)
    if(!f || f<100){ setRes('Pon ejemplo: 70000 o 120000'); return }
    
    let mes=230
    if(f>6700 && f<=15000) mes=294
    else if(f>15000 && f<=30000) mes=350
    else if(f>30000 && f<=50000) mes=425
    else if(f>50000) mes=530
    
    const anual=mes*12
    const gastos=Math.round(f*0.3)
    const base=Math.round(f-gastos-anual)
    const irpf=Math.round(base*0.20)
    const neto=Math.round(base-irpf)

    setRes({f,mes,anual,gastos,base,irpf,neto})
  }

  return(
    <div style={{minHeight:'100vh',background:'#0a1020',color:'white',display:'flex',justifyContent:'center',padding:'20px',fontFamily:'system-ui'}}>
      <div style={{width:'100%',maxWidth:'600px'}}>
        <div style={{background:'#162032',borderRadius:'20px',padding:'24px',border:'1px solid #2a3a55'}}>
          <h1 style={{fontSize:'32px',fontWeight:'800',textAlign:'center',margin:0}}>⚖️ AbogadoBot España</h1>
          <p style={{textAlign:'center',color:'#94a3b8',fontSize:'13px',marginTop:'6px'}}>RETA 2025-26 · IVA · IRPF · Neto Real · Motor Determinista</p>
          
          <div style={{background:'#0f172a',borderRadius:'14px',padding:'16px',marginTop:'20px',border:'1px solid #1e293b'}}>
            <p style={{color:'#4ade80',fontSize:'14px',margin:0}}>¡Hola! Soy tu asistente. Dime tu facturación anual.</p>
            {res && typeof res==='object' && (
              <div style={{marginTop:'16px',background:'#1e293b',padding:'14px',borderRadius:'10px',fontSize:'14px',lineHeight:'1.7'}}>
                <div>Facturación: <b>{res.f.toLocaleString()} €/año</b></div>
                <div>Tramo RETA 2025-26: <b style={{color:'#60a5fa'}}>{res.mes} €/mes</b></div>
                <div>RETA anual: {res.anual.toLocaleString()} €</div>
                <div>Gastos 30%: {res.gastos.toLocaleString()} €</div>
                <div>Base: {res.base.toLocaleString()} €</div>
                <div>IRPF 20%: {res.irpf.toLocaleString()} €</div>
                <div style={{marginTop:'8px',paddingTop:'8px',borderTop:'1px solid #334155',fontSize:'16px'}}>NETO: <b style={{color:'#22c55e'}}>{res.neto.toLocaleString()} €/año</b></div>
              </div>
            )}
            {res && typeof res==='string' && <p style={{marginTop:'12px',color:'#fbbf24'}}>{res}</p>}
          </div>

          <div style={{display:'flex',gap:'8px',marginTop:'16px'}}>
            <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Ej: 70000" style={{flex:1,background:'#0f172a',border:'1px solid #334155',borderRadius:'12px',padding:'12px 14px',color:'white',outline:'none'}}/>
            <button onClick={calc} style={{background:'#2563eb',border:'none',borderRadius:'12px',padding:'0 22px',color:'white',fontWeight:'700',cursor:'pointer'}}>ENVIAR</button>
          </div>
        </div>
        <p style={{textAlign:'center',fontSize:'11px',color:'#64748b',marginTop:'12px'}}>Aviso RGPD: asistente informativo. No sustituye abogado colegiado.</p>
      </div>
    </div>
  )
}
