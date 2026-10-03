import { useState } from 'react'

export default function App(){
  const [tab,setTab]=useState('calc')
  const [input,setInput]=useState('')
  const [res,setRes]=useState(null)
  const [alta,setAlta]=useState({tipo:'primera', tarifa:'si', epigrafe:''})

  const calc=()=>{
    let txt=input.replace(/[^0-9kK]/g,'').toLowerCase()
    let f=txt.includes('k')?parseFloat(txt)*1000:parseFloat(txt)
    if(!f || f<100){ setRes('Pon ejemplo: 70000'); return }
    let mes=230
    if(f>6700 && f<=15000) mes=294
    else if(f>15000 && f<=30000) mes=350
    else if(f>30000 && f<=50000) mes=425
    else if(f>50000) mes=530
    const anual=mes*12, gastos=Math.round(f*0.3), base=Math.round(f-gastos-anual), irpf=Math.round(base*0.20), neto=Math.round(base-irpf)
    setRes({f,mes,anual,gastos,base,irpf,neto})
  }

  const TabBtn=({id,label})=>(
    <button onClick={()=>setTab(id)} style={{flex:1,padding:'12px',borderRadius:'12px',border:'none',background:tab===id?'#2563eb':'#1e293b',color:'white',fontWeight:tab===id?'700':'400',cursor:'pointer'}}>{label}</button>
  )

  return(
    <div style={{minHeight:'100vh',background:'#0a1020',color:'white',display:'flex',justifyContent:'center',padding:'16px',fontFamily:'system-ui'}}>
      <div style={{width:'100%',maxWidth:'680px'}}>
        <h1 style={{fontSize:'30px',fontWeight:'800',textAlign:'center',margin:'10px 0'}}>⚖️ AbogadoBot España</h1>
        <p style={{textAlign:'center',color:'#94a3b8',fontSize:'12px',marginBottom:'16px'}}>RETA 2025-26 · Alta Autónomos · IA Determinista</p>

        <div style={{display:'flex',gap:'8px',marginBottom:'16px'}}>
          <TabBtn id='calc' label='💰 Calculadora' />
          <TabBtn id='alta' label='🚀 Alta Autónomo' />
          <TabBtn id='guia' label='📚 Guía' />
        </div>

        <div style={{background:'#162032',borderRadius:'20px',padding:'20px',border:'1px solid #2a3a55'}}>
          
          {tab==='calc' && <>
            <div style={{background:'#0f172a',borderRadius:'14px',padding:'16px',border:'1px solid #1e293b'}}>
              <p style={{color:'#4ade80',fontSize:'14px',margin:0}}>¡Hola! Dime tu facturación anual.</p>
              {res && typeof res==='object' && (
                <div style={{marginTop:'14px',background:'#1e293b',padding:'14px',borderRadius:'10px',fontSize:'14px',lineHeight:'1.7'}}>
                  <div>Facturación: <b>{res.f.toLocaleString()} €/año</b></div>
                  <div>Tramo RETA: <b style={{color:'#60a5fa'}}>{res.mes} €/mes</b></div>
                  <div>RETA anual: {res.anual.toLocaleString()} €</div>
                  <div>Gastos 30%: {res.gastos.toLocaleString()} €</div>
                  <div>Base: {res.base.toLocaleString()} €</div>
                  <div>IRPF: {res.irpf.toLocaleString()} €</div>
                  <div style={{marginTop:'8px',borderTop:'1px solid #334155',paddingTop:'8px',fontSize:'16px'}}>NETO: <b style={{color:'#22c55e'}}>{res.neto.toLocaleString()} €/año</b></div>
                </div>
              )}
            </div>
            <div style={{display:'flex',gap:'8px',marginTop:'16px'}}>
              <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Ej: 50000" style={{flex:1,background:'#0f172a',border:'1px solid #334155',borderRadius:'12px',padding:'12px',color:'white',outline:'none'}}/>
              <button onClick={calc} style={{background:'#2563eb',border:'none',borderRadius:'12px',padding:'0 22px',color:'white',fontWeight:'700'}}>ENVIAR</button>
            </div>
          </>}

          {tab==='alta' && <div>
            <h3 style={{margin:'0 0 10px 0'}}>🚀 Darse de Alta como Autónomo 2025-26</h3>
            <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
              <label style={{fontSize:'13px',color:'#94a3b8'}}>¿Es tu primera vez?
                <select value={alta.tipo} onChange={e=>setAlta({...alta,tipo:e.target.value})} style={{width:'100%',marginTop:'6px',background:'#0f172a',border:'1px solid #334155',borderRadius:'10px',padding:'10px',color:'white'}}>
                  <option value='primera'>Sí, primera vez</option>
                  <option value='vuelta'>Vuelvo tras 2 años</option>
                </select>
              </label>
              <label style={{fontSize:'13px',color:'#94a3b8'}}>¿Tarifa plana?
                <select value={alta.tarifa} onChange={e=>setAlta({...alta,tarifa:e.target.value})} style={{width:'100%',marginTop:'6px',background:'#0f172a',border:'1px solid #334155',borderRadius:'10px',padding:'10px',color:'white'}}>
                  <option value='si'>Sí, quiero 80€/mes</option>
                  <option value='no'>No, tramo por ingresos</option>
                </select>
              </label>
              <input placeholder="Epígrafe IAE (ej: 651, 731, 763)" value={alta.epigrafe} onChange={e=>setAlta({...alta,epigrafe:e.target.value})} style={{background:'#0f172a',border:'1px solid #334155',borderRadius:'10px',padding:'12px',color:'white'}}/>
            </div>

            <div style={{marginTop:'18px',background:'#0f172a',borderRadius:'12px',padding:'16px',border:'1px solid #1e293b',lineHeight:'1.8',fontSize:'13px'}}>
              <b style={{color:'#4ade80'}}>Tu Checklist Oficial:</b><br/>
              1. <b>AEAT - Modelo 036/037:</b> Alta censal. Marca casilla 111, pon epígrafe {alta.epigrafe||'___'}, fecha alta.<br/>
              2. <b>Seguridad Social - Importass:</b> Alta RETA. Elige tramo: {alta.tarifa==='si' ? '80€/mes 12 meses (Tarifa Plana)' : 'Por ingresos reales (230€-590€/mes)'}<br/>
              3. <b>Tarifa Plana 2025:</b> {alta.tipo==='primera' ? '✅ Tienes derecho. 80€/mes año 1.' : '✅ Si pasaron 2 años, también 80€/mes.'}<br/>
              4. <b>Libros:</b> Lleva libro de ingresos/gastos.<br/>
              5. <b>Trimestral:</b> Modelo 130 IRPF + Modelo 303 IVA.<br/>
              <div style={{marginTop:'10px',padding:'10px',background:'#1e293b',borderRadius:'8px'}}>💡 Con {alta.epigrafe||'tu epígrafe'} puedes facturar desde mañana. Guarda justificantes de alta.</div>
            </div>
          </div>}

          {tab==='guia' && <div style={{fontSize:'13px',lineHeight:'1.8',color:'#cbd5e1'}}>
            <b>¿Cuánto paga un autónomo en 2025-26?</b><br/>
            - Mínimo 230€ si ganas &lt;6700€<br/>
            - Medio 350€-425€ si ganas 15k-50k<br/>
            - Máximo 590€ si ganas +170k<br/><br/>
            <b>¿Qué es el Motor Determinista?</b><br/>
            No inventa. Calcula por tablas BOE reales, no IA generativa.<br/><br/>
            <b>Aviso Legal:</b> Informativo, no sustituye asesoría.
          </div>}

        </div>
        <p style={{textAlign:'center',fontSize:'11px',color:'#64748b',marginTop:'12px'}}>AbogadoBot v2 PRO · RGPD informativo</p>
      </div>
    </div>
  )
}
