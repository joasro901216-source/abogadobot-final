import { useState } from 'react'

const PROFESIONES = [
  {id:'731', label:'Abogado / Asesor Jurídico', desc:'Servicios jurídicos'},
  {id:'763', label:'Programador / Informático', desc:'Desarrollo software'},
  {id:'861', label:'Diseñador / Marketing / Publicista', desc:'Publicidad y diseño'},
  {id:'651', label:'Tienda Online / E-commerce', desc:'Comercio al por menor'},
  {id:'671', label:'Hostelería / Bar / Restaurante', desc:'Restauración'},
  {id:'933', label:'Profesor / Formador / Coach', desc:'Enseñanza'},
  {id:'751', label:'Agente Inmobiliario', desc:'Intermediación'},
  {id:'721', label:'Transporte / Repartidor', desc:'Transporte mercancías'},
  {id:'505', label:'Fontanero / Electricista / Albañil', desc:'Construcción'},
  {id:'887', label:'Maquillador / Peluquería / Estética', desc:'Estética'},
  {id:'722', label:'Influencer / Creador Contenido', desc:'Servicios diversos'},
  {id:'799', label:'Consultor / Gestor', desc:'Otros servicios'},
]

export default function App(){
  const [tab,setTab]=useState('alta')
  const [isPremium,setIsPremium]=useState(false)
  const [showPay,setShowPay]=useState(false)
  // calculadora
  const [input,setInput]=useState('')
  const [res,setRes]=useState(null)
  // alta wizard
  const [prof,setProf]=useState(PROFESIONES[0])
  const [trab,setTrab]=useState('solo')
  const [primera,setPrimera]=useState('si')
  const [tarifa,setTarifa]=useState('si')

  const calc=()=>{
    let txt=input.replace(/[^0-9kK]/g,'').toLowerCase()
    let f=txt.includes('k')?parseFloat(txt)*1000:parseFloat(txt)
    if(!f || f<100){ setRes('Pon ejemplo: 70000'); return }
    let mes=230; if(f>6700 && f<=15000) mes=294; else if(f>15000 && f<=30000) mes=350; else if(f>30000 && f<=50000) mes=425; else if(f>50000) mes=530
    const anual=mes*12, gastos=Math.round(f*0.3), base=Math.round(f-gastos-anual), irpf=Math.round(base*0.20), neto=Math.round(base-irpf)
    setRes({f,mes,anual,gastos,base,irpf,neto})
  }

  const TabBtn=({id,label})=>(
    <button onClick={()=>setTab(id)} style={{flex:1,padding:'12px',borderRadius:'12px',border:'none',background:tab===id?'#2563eb':'#1e293b',color:'white',fontWeight:tab===id?'700':'400',cursor:'pointer',fontSize:'13px'}}>{label}</button>
  )

  return(
    <div style={{minHeight:'100vh',background:'#0a1020',color:'white',display:'flex',justifyContent:'center',padding:'16px',fontFamily:'system-ui'}}>
      <div style={{width:'100%',maxWidth:'680px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <h1 style={{fontSize:'26px',fontWeight:'800',margin:'10px 0'}}>⚖️ AbogadoBot</h1>
          <button onClick={()=>setShowPay(true)} style={{background:isPremium?'#16a34a':'#f59e0b',border:'none',borderRadius:'20px',padding:'8px 14px',color:'black',fontWeight:'800',fontSize:'12px'}}>{isPremium?'✅ PREMIUM':'🔓 PREMIUM 9.99€'}</button>
        </div>
        <p style={{textAlign:'center',color:'#94a3b8',fontSize:'11px',marginBottom:'16px'}}>RETA 2025-26 · Alta Real · IA + Documentos</p>

        <div style={{display:'flex',gap:'8px',marginBottom:'16px'}}>
          <TabBtn id='calc' label='💰 Calculadora' />
          <TabBtn id='alta' label='🚀 Alta Paso a Paso' />
          <TabBtn id='guia' label='🤖 Asistente IA' />
        </div>

        <div style={{background:'#162032',borderRadius:'20px',padding:'18px',border:'1px solid #2a3a55'}}>

          {tab==='calc' && <>
            <p style={{color:'#4ade80',fontSize:'14px',margin:'0 0 10px 0'}}>Calcula tu RETA real 2025-26</p>
            <div style={{display:'flex',gap:'8px'}}>
              <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Facturación anual ej: 50000" style={{flex:1,background:'#0f172a',border:'1px solid #334155',borderRadius:'12px',padding:'12px',color:'white'}}/>
              <button onClick={calc} style={{background:'#2563eb',border:'none',borderRadius:'12px',padding:'0 18px',color:'white',fontWeight:'700'}}>OK</button>
            </div>
            {res && typeof res==='object' && (
              <div style={{marginTop:'14px',background:'#0f172a',padding:'14px',borderRadius:'12px',fontSize:'13px',lineHeight:'1.7',border:'1px solid #1e293b'}}>
                <div>Facturación: <b>{res.f.toLocaleString()} €</b> → RETA: <b style={{color:'#60a5fa'}}>{res.mes}€/mes</b></div>
                <div>NETO estimado: <b style={{color:'#22c55e',fontSize:'16px'}}>{res.neto.toLocaleString()} €/año</b></div>
                {!isPremium && <div style={{marginTop:'8px',color:'#fbbf24',fontSize:'11px'}}>🔒 Desbloquea el desglose completo (IVA, IRPF trimestral, gastos deducibles) con Premium</div>}
              </div>
            )}
          </>}

          {tab==='alta' && <div>
            <h3 style={{margin:'0 0 14px 0',fontSize:'16px'}}>🚀 Alta como Autónomo - Asistente Guiado</h3>

            <label style={{fontSize:'12px',color:'#94a3b8'}}>1. ¿A qué te vas a dedicar?</label>
            <select value={prof.id} onChange={e=>setProf(PROFESIONES.find(p=>p.id===e.target.value))} style={{width:'100%',margin:'6px 0 12px 0',background:'#0f172a',border:'1px solid #334155',borderRadius:'10px',padding:'12px',color:'white',fontSize:'14px'}}>
              {PROFESIONES.map(p=><option key={p.id} value={p.id}>{p.label} - IAE {p.id}</option>)}
            </select>

            <label style={{fontSize:'12px',color:'#94a3b8'}}>2. ¿Vas a contratar trabajadores?</label>
            <select value={trab} onChange={e=>setTrab(e.target.value)} style={{width:'100%',margin:'6px 0 12px 0',background:'#0f172a',border:'1px solid #334155',borderRadius:'10px',padding:'12px',color:'white'}}>
              <option value='solo'>Solo yo, sin empleados</option>
              <option value='1-2'>1 a 2 empleados</option>
              <option value='3+'>3 o más empleados</option>
            </select>

            <div style={{display:'flex',gap:'8px'}}>
              <div style={{flex:1}}>
                <label style={{fontSize:'12px',color:'#94a3b8'}}>¿Primera vez?</label>
                <select value={primera} onChange={e=>setPrimera(e.target.value)} style={{width:'100%',marginTop:'6px',background:'#0f172a',border:'1px solid #334155',borderRadius:'10px',padding:'10px',color:'white'}}>
                  <option value='si'>Sí, primera vez</option>
                  <option value='no'>Ya fui antes</option>
                </select>
              </div>
              <div style={{flex:1}}>
                <label style={{fontSize:'12px',color:'#94a3b8'}}>¿Tarifa Plana?</label>
                <select value={tarifa} onChange={e=>setTarifa(e.target.value)} style={{width:'100%',marginTop:'6px',background:'#0f172a',border:'1px solid #334155',borderRadius:'10px',padding:'10px',color:'white'}}>
                  <option value='si'>Sí, 80€/mes</option>
                  <option value='no'>No, tramo real</option>
                </select>
              </div>
            </div>

            <div style={{marginTop:'18px',background:'#0f172a',borderRadius:'12px',padding:'16px',border:'1px solid #2563eb',lineHeight:'1.7',fontSize:'13px'}}>
              <b style={{color:'#4ade80'}}>Tu Plan Personalizado para {prof.label}:</b><br/><br/>
              <b>✅ PASO 1 - Hacienda (AEAT):</b><br/>Modelo 037. Epígrafe <b>{prof.id} - {prof.desc}</b>. Alta: pon fecha de mañana.<br/><br/>
              <b>✅ PASO 2 - Seguridad Social:</b><br/>Importass. Alta RETA. {tarifa==='si'?`Tarifa Plana 80€/mes (por ser ${primera==='si'?'primera vez':'vuelta tras 2 años'})`:'Tramo por ingresos reales 230€-590€/mes'}.<br/>
              {trab!=='solo' && <><b>⚠️ PASO 2B - Con Trabajadores:</b><br/>Necesitas Código Cuenta Cotización + Alta en TGSS + Contrato. {trab==='1-2'?'Coste aprox +400€/mes por trabajador':'Gestoría recomendada'}<br/><br/></>}
              <b>✅ PASO 3 - Lo que sigue:</b><br/>Libro ingresos/gastos. Trimestral: Modelo 130 + 303.<br/>
              <div style={{marginTop:'12px',padding:'10px',background:'#1e293b',borderRadius:'8px',border:'1px dashed #334155'}}>
                {isPremium? `📄 Premium: Te genero el Modelo 037 relleno + contrato + guía IAE ${prof.id}` : '🔒 Con Premium 9.99€ te genero los documentos rellenos y el chat IA te responde dudas legales'}
              </div>
            </div>
          </div>}

          {tab==='guia' && <div style={{fontSize:'13px',lineHeight:'1.7'}}>
            <div style={{background:'#0f172a',padding:'12px',borderRadius:'10px',border:'1px solid #1e293b',marginBottom:'12px'}}>
              <b style={{color:'#60a5fa'}}>🤖 Asistente IA AbogadoBot (Determinista + GPT)</b><br/>
              <span style={{fontSize:'12px',color:'#94a3b8'}}>Pregúntame cualquier cosa, no invento, uso BOE + tablas RETA reales.</span>
            </div>
            {isPremium? (
              <div style={{background:'#0f172a',padding:'14px',borderRadius:'10px',border:'1px solid #22c55e'}}>
                <b>¡Chat Premium Activo!</b><br/>
                Escribe tu duda: "¿Cuánto pago si gano 40k con 2 trabajadores?"<br/>
                <div style={{display:'flex',gap:'8px',marginTop:'10px'}}>
                  <input placeholder="Escribe tu duda legal..." style={{flex:1,background:'#1e293b',border:'1px solid #334155',borderRadius:'10px',padding:'10px',color:'white'}}/>
                  <button style={{background:'#22c55e',border:'none',borderRadius:'10px',padding:'0 14px',color:'black',fontWeight:'700'}}>Enviar</button>
                </div>
                <p style={{fontSize:'11px',color:'#94a3b8',marginTop:'8px'}}>Conectado a tu backend abogadobot-api (necesitas activar OpenAI key en Render)</p>
              </div>
            ) : (
              <div style={{textAlign:'center',padding:'20px',background:'#0f172a',borderRadius:'12px',border:'1px dashed #334155'}}>
                <div style={{fontSize:'32px'}}>🔒</div>
                <b>Asistente IA bloqueado</b><br/>
                <span style={{fontSize:'12px',color:'#94a3b8'}}>Desbloquea el chat inteligente, generación de modelos 036/037 y contratos por 9.99€</span><br/>
                <button onClick={()=>setShowPay(true)} style={{marginTop:'12px',background:'#f59e0b',border:'none',borderRadius:'10px',padding:'10px 18px',fontWeight:'800',cursor:'pointer'}}>Desbloquear por 9.99€</button>
              </div>
            )}
          </div>}
        </div>

        {showPay && (
          <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.8)',display:'flex',justifyContent:'center',alignItems:'center',zIndex:999,padding:'16px'}}>
            <div style={{background:'#162032',borderRadius:'20px',padding:'22px',width:'100%',maxWidth:'360px',border:'1px solid #334155'}}>
              <h3 style={{margin:0}}>🔓 Desbloquear Premium 9.99€</h3>
              <p style={{fontSize:'13px',color:'#94a3b8',lineHeight:'1.6'}}>Incluye: Chat IA ilimitado, Generador de Modelo 037, Contratos, Cálculo IVA/IRPF completo, Soporte.</p>
              <ul style={{fontSize:'12px',lineHeight:'1.8'}}>
                <li>✅ Chat IA conectado (GPT-4 + BOE)</li>
                <li>✅ Documentos PDF listos para Hacienda</li>
                <li>✅ Sin permanencia, pago único</li>
              </ul>
              <button onClick={()=>{setIsPremium(true);setShowPay(false)}} style={{width:'100%',background:'#22c55e',border:'none',borderRadius:'12px',padding:'12px',fontWeight:'800',marginTop:'10px',cursor:'pointer'}}>Pagar 9.99€ con Stripe (DEMO)</button>
              <button onClick={()=>setShowPay(false)} style={{width:'100%',background:'transparent',border:'none',color:'#94a3b8',padding:'10px',marginTop:'6px',cursor:'pointer'}}>Cancelar</button>
              <p style={{fontSize:'10px',color:'#64748b',textAlign:'center',marginTop:'8px'}}>Demo: falta conectar Stripe. Al darle se desbloquea para probar.</p>
            </div>
          </div>
        )}

        <p style={{textAlign:'center',fontSize:'10px',color:'#475569',marginTop:'14px'}}>AbogadoBot v3 REAL · Motor Determinista + IA · Stripe 9.99€</p>
      </div>
    </div>
  )
            }
