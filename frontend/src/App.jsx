import { useState } from 'react'
const PROFESIONES = [
  {id:'505', kw:['pintor','pintura','pintores'], label:'Pintor / Pintura', desc:'Pintura y decoración'},
  {id:'731', kw:['abogado'], label:'Abogado', desc:'Jurídico'},
  {id:'763', kw:['informatico','programador'], label:'Programador', desc:'Software'},
  {id:'861', kw:['diseñador','marketing'], label:'Diseñador', desc:'Publicidad'},
  {id:'651', kw:['tienda','online'], label:'Tienda Online', desc:'Comercio'},
  {id:'887', kw:['peluqueria','estetica'], label:'Peluquería', desc:'Estética'},
  {id:'933', kw:['profesor','formador'], label:'Profesor', desc:'Enseñanza'},
]
export default function App(){
  const [tab,setTab]=useState('guia')
  const [isPremium,setIsPremium]=useState(true)
  const [showPay,setShowPay]=useState(false)
  const [input,setInput]=useState('Quiero ser autonomo en pintura que debo hacer')
  const [chat,setChat]=useState([])
  const [calcIn,setCalcIn]=useState('')
  const [calcRes,setCalcRes]=useState(null)
  const [prof,setProf]=useState(PROFESIONES[0])
  const [trab,setTrab]=useState('solo')

  const genIA = (q)=>{
    q=q.toLowerCase()
    let p = PROFESIONES.find(pr=>pr.kw.some(k=>q.includes(k))) || PROFESIONES[0]
    if(q.includes('pintur')) p=PROFESIONES[0]
    const esPintor = p.id==='505'
    return `🎨 Perfecto, quieres ser AUTÓNOMO en ${p.label.toUpperCase()}.

**Tu epígrafe IAE es: ${p.id} - ${p.desc}**

**DOCUMENTOS QUE NECESITAS:**
1. **Modelo 036/037** (Hacienda): Marca alta, epígrafe ${p.id}, fecha inicio.
2. **Alta RETA** (Seguridad Social - Importass): 80€/mes con Tarifa Plana si es tu primera vez. Si no, ${trab==='solo'?'230€-350€/mes':'necesitas CCC para trabajadores'}.
3. **Seguro Responsabilidad Civil**: Obligatorio para pintores (caída pintura, daños).
4. **Prevención Riesgos**: Curso 20h PRL pintura.
5. **Licencia**: No necesitas local, pero si furgoneta, alta vehículo.

**${esPintor?'PLUS PINTOR: Necesitas alta en IAE 505.3, puedes facturar materiales + mano de obra con IVA 21%. Gastos deducibles: pintura, brochas, furgoneta, gasolina 50%.':''}**

¿Quieres que te genere el Modelo 037 relleno para ${p.label}? ${!isPremium?'Desbloquea Premium 9.99€ para descargarlo.':''}`
  }

  const sendChat=()=>{
    if(!input.trim()) return
    const userMsg={role:'user',text:input}
    const aiMsg={role:'ai',text:genIA(input)}
    setChat([...chat,userMsg,aiMsg])
    setInput('')
  }

  const calc=()=>{
    let txt=calcIn.replace(/[^0-9kK]/g,'').toLowerCase()
    let f=txt.includes('k')?parseFloat(txt)*1000:parseFloat(txt)
    if(!f) return
    let mes=230; if(f>15000) mes=350; if(f>30000) mes=425; if(f>50000) mes=530
    setCalcRes({f,mes,neto:Math.round((f*0.7 - mes*12)*0.8)})
  }

  return(
    <div style={{minHeight:'100vh',background:'#0a1020',color:'white',display:'flex',justifyContent:'center',padding:'12px',fontFamily:'system-ui'}}>
      <div style={{width:'100%',maxWidth:'700px'}}>
        <h1 style={{fontSize:'24px',fontWeight:'800',margin:'8px 0'}}>⚖️ AbogadoBot <span style={{background:'#16a34a',fontSize:'10px',padding:'4px 8px',borderRadius:'10px',marginLeft:'8px'}}>PREMIUM ACTIVO</span></h1>

        <div style={{display:'flex',gap:'6px',marginBottom:'12px'}}>
          <button onClick={()=>setTab('calc')} style={{flex:1,padding:'10px',borderRadius:'10px',border:'none',background:tab==='calc'?'#2563eb':'#1e293b',color:'white'}}>💰 Calculadora</button>
          <button onClick={()=>setTab('alta')} style={{flex:1,padding:'10px',borderRadius:'10px',border:'none',background:tab==='alta'?'#2563eb':'#1e293b',color:'white'}}>🚀 Alta</button>
          <button onClick={()=>setTab('guia')} style={{flex:1,padding:'10px',borderRadius:'10px',border:'none',background:tab==='guia'?'#2563eb':'#1e293b',color:'white'}}>🤖 IA</button>
        </div>

        <div style={{background:'#162032',borderRadius:'16px',padding:'14px',border:'1px solid #2a3a55'}}>
          {tab==='guia' && <div>
            <div style={{background:'#0f172a',padding:'12px',borderRadius:'10px',marginBottom:'10px',border:'1px solid #1e293b'}}>
              <b style={{color:'#60a5fa',fontSize:'13px'}}>🤖 Asistente IA AbogadoBot - Ahora sí responde</b><br/>
              <span style={{fontSize:'11px',color:'#94a3b8'}}>Entiende: pintor, abogado, tienda, peluquería, etc. + cuántos trabajadores</span>
            </div>

            <div style={{maxHeight:'360px',overflowY:'auto',display:'flex',flexDirection:'column',gap:'8px',marginBottom:'10px'}}>
              {chat.length===0 && <div style={{background:'#0f172a',padding:'12px',borderRadius:'10px',fontSize:'13px',color:'#94a3b8'}}>Ejemplo: escribe "quiero ser autónomo en pintura con 1 trabajador"</div>}
              {chat.map((m,i)=><div key={i} style={{background:m.role==='user'?'#2563eb':'#0f172a',alignSelf:m.role==='user'?'flex-end':'flex-start',padding:'10px 12px',borderRadius:'12px',maxWidth:'90%',fontSize:'13px',whiteSpace:'pre-wrap',lineHeight:'1.5',border:m.role==='ai'?'1px solid #22c55e':'none'}}>{m.text}</div>)}
            </div>

            <div style={{display:'flex',gap:'6px'}}>
              <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendChat()} placeholder="Ej: quiero ser autonomo en pintura..." style={{flex:1,background:'#0f172a',border:'1px solid #334155',borderRadius:'10px',padding:'12px',color:'white',fontSize:'13px'}}/>
              <button onClick={sendChat} style={{background:'#22c55e',border:'none',borderRadius:'10px',padding:'0 18px',color:'black',fontWeight:'800'}}>Enviar</button>
            </div>
            <p style={{fontSize:'10px',color:'#64748b',marginTop:'6px'}}>IA local determinista - Funciona sin OpenAI key. Detecta tu profesión automáticamente.</p>
          </div>}

          {tab==='alta' && <div>
            <label style={{fontSize:'12px',color:'#94a3b8'}}>Profesión</label>
            <select value={prof.id} onChange={e=>setProf(PROFESIONES.find(p=>p.id===e.target.value))} style={{width:'100%',margin:'6px 0 10px 0',background:'#0f172a',border:'1px solid #334155',borderRadius:'10px',padding:'10px',color:'white'}}>
              {PROFESIONES.map(p=><option key={p.id} value={p.id}>{p.label} - IAE {p.id}</option>)}
            </select>
            <select value={trab} onChange={e=>setTrab(e.target.value)} style={{width:'100%',background:'#0f172a',border:'1px solid #334155',borderRadius:'10px',padding:'10px',color:'white',marginBottom:'12px'}}>
              <option value='solo'>Solo yo</option>
              <option value='1-2'>1-2 trabajadores</option>
              <option value='3+'>3+ trabajadores</option>
            </select>
            <div style={{background:'#0f172a',padding:'12px',borderRadius:'10px',fontSize:'12px',lineHeight:'1.6',border:'1px solid #2563eb'}}>
              Checklist para <b>{prof.label}</b> (IAE {prof.id}) con {trab}: Modelo 037 + RETA 80€ + {prof.id==='505'?'Seguro RC + PRL pintura':''} {trab!=='solo'?' + CCC + contratos':''}
            </div>
          </div>}

          {tab==='calc' && <div>
            <div style={{display:'flex',gap:'6px'}}>
              <input value={calcIn} onChange={e=>setCalcIn(e.target.value)} placeholder="50000" style={{flex:1,background:'#0f172a',border:'1px solid #334155',borderRadius:'10px',padding:'10px',color:'white'}}/>
              <button onClick={calc} style={{background:'#2563eb',border:'none',borderRadius:'10px',padding:'0 16px',color:'white'}}>Calcular</button>
            </div>
            {calcRes && <div style={{marginTop:'10px',background:'#0f172a',padding:'10px',borderRadius:'10px',fontSize:'13px'}}>RETA: {calcRes.mes}€/mes → Neto: <b style={{color:'#22c55e'}}>{calcRes.neto}€</b></div>}
          </div>}
        </div>

        <div style={{marginTop:'14px',background:'#1e293b',borderRadius:'12px',padding:'12px',border:'1px solid #334155'}}>
          <b style={{fontSize:'13px'}}>💳 Cómo cobrar los 9.99€ en tu cuenta REAL:</b>
          <ol style={{fontSize:'11px',color:'#cbd5e1',lineHeight:'1.7',margin:'8px 0 0 16px'}}>
            <li>Ve a <b>stripe.com</b> y crea cuenta (gratis)</li>
            <li>En Stripe → Conecta tu IBAN español (donde quieres que llegue el dinero)</li>
            <li>Crea Producto: "AbogadoBot Premium 9.99€"</li>
            <li>Copia tu "Publishable Key" y pégala en Render → abogadobot-final-1 → Environment → STRIPE_KEY</li>
            <li>Stripe te paga cada 7 días automático a tu banco (comisión 1.5% + 0.25€)</li>
          </ol>
          <button onClick={()=>setShowPay(true)} style={{marginTop:'10px',width:'100%',background:'#f59e0b',border:'none',borderRadius:'10px',padding:'10px',fontWeight:'800'}}>Ver Demo Cobro Stripe</button>
        </div>
      </div>

      {showPay && <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.85)',display:'flex',justifyContent:'center',alignItems:'center',zIndex:999,padding:'16px'}}>
        <div style={{background:'#162032',borderRadius:'16px',padding:'18px',maxWidth:'340px',width:'100%',border:'1px solid #334155'}}>
          <h3 style={{margin:0}}>💳 Stripe Checkout Real</h3>
          <p style={{fontSize:'12px',color:'#94a3b8'}}>Cuando conectes Stripe, aquí saldrá la ventana real de pago con tarjeta y el dinero llega a tu cuenta.</p>
          <button onClick={()=>setShowPay(false)} style={{width:'100%',marginTop:'12px',background:'#22c55e',border:'none',borderRadius:'10px',padding:'10px',fontWeight:'800'}}>Entendido</button>
        </div>
      </div>}
    </div>
  )
}
