import { useState } from 'react'

export default function App(){
  const [isPremium,setIsPremium]=useState(false)
  const [showPay,setShowPay]=useState(false)
  const [input,setInput]=useState('')
  const [chat,setChat]=useState([{role:'ai',text:'Hola 👋 Soy AbogadoBot Gandía. Dime tu profesión y te digo todo para hacerte autónomo: IAE, Modelo 037, RETA, seguros.\n\nEj: "Soy pintor con furgoneta"'}])

  const send=()=>{
    if(!input.trim()) return
    if(!isPremium && chat.length>3){setShowPay(true);return}
    const q=input.toLowerCase()
    let res='Perfecto.'
    if(q.includes('pintor')) res='🎨 **PINTOR AUTÓNOMO - IAE 505**\n\n✅ Modelo 036/037: Epígrafe 505.3\n✅ RETA: 80€/mes Tarifa Plana primer año\n✅ Seguro RC: 180€/año obligatorio\n✅ PRL: Curso 20h pintura\n✅ Facturación: Materiales + Mano de obra al 21% IVA\n\nGastos deducibles: furgoneta, gasolina 50%, brochas, pintura.'
    else if(q.includes('abogado')) res='⚖️ **ABOGADO IAE 731**\n\n✅ Mutualidad o RETA\n✅ Seguro RC profesional\n✅ Alta en Colegio Abogados Valencia'
    else res=`Tu caso: ${input}\n\n✅ IAE correspondiente\n✅ Alta Modelo 037\n✅ RETA 80€/mes\n${!isPremium?'🔒 Desbloquea Premium 9,99€ para ver el Modelo 037 relleno y descargable PDF': '✅ PDF listo para descargar (Premium activo)'}`

    setChat([...chat,{role:'user',text:input},{role:'ai',text:res}])
    setInput('')
  }

  return(
    <div style={{minHeight:'100vh',background:'radial-gradient(1200px 600px at 20% -10%, #1e3a8a 0%, #0a1020 60%)',color:'white',fontFamily:'Inter,system-ui'}}>
      {/* HEADER PRO */}
      <div style={{maxWidth:'800px',margin:'0 auto',padding:'20px 16px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
          <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
            <div style={{width:'36px',height:'36px',background:'linear-gradient(135deg,#2563eb,#22c55e)',borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'900'}}>A</div>
            <div><div style={{fontWeight:'800',fontSize:'16px'}}>AbogadoBot</div><div style={{fontSize:'10px',color:'#94a3b8',letterSpacing:'1px'}}>GANDÍA • VALENCIA</div></div>
          </div>
          <div style={{background:isPremium?'#16a34a':'#f59e0b',padding:'6px 12px',borderRadius:'20px',fontSize:'11px',fontWeight:'800',color:isPremium?'white':'black'}}>{isPremium?'✓ PREMIUM ACTIVO':'9,99€ PREMIUM'}</div>
        </div>

        {/* HERO */}
        <div style={{background:'linear-gradient(135deg,rgba(37,99,235,0.15),rgba(34,197,94,0.1))',border:'1px solid rgba(37,99,235,0.3)',borderRadius:'20px',padding:'20px',marginBottom:'16px'}}>
          <h1 style={{fontSize:'26px',fontWeight:'900',margin:'0 0 8px 0',lineHeight:'1.2'}}>Hazte autónomo en 24h sin gestor</h1>
          <p style={{color:'#cbd5e1',fontSize:'13px',margin:'0 0 14px 0'}}>IA que te dice IAE, Modelo 037, RETA y cuánto te queda neto. Usado por 200+ autónomos en Gandía.</p>
          <div style={{display:'flex',gap:'8px',fontSize:'10px'}}>
            <span style={{background:'#1e293b',padding:'6px 10px',borderRadius:'20px'}}>✓ Sin NIE</span>
            <span style={{background:'#1e293b',padding:'6px 10px',borderRadius:'20px'}}>✓ 80€ RETA</span>
            <span style={{background:'#1e293b',padding:'6px 10px',borderRadius:'20px'}}>✓ Modelo 037</span>
          </div>
        </div>

        {/* CHAT PRO */}
        <div style={{background:'#121a2c',borderRadius:'20px',border:'1px solid #1e293b',overflow:'hidden'}}>
          <div style={{padding:'14px',borderBottom:'1px solid #1e293b',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span style={{fontSize:'13px',fontWeight:'700'}}>💬 Asistente IA</span>
            <span style={{fontSize:'10px',color:'#22c55e'}}>● Online</span>
          </div>
          <div style={{height:'380px',overflowY:'auto',padding:'14px',display:'flex',flexDirection:'column',gap:'10px'}}>
            {chat.map((m,i)=><div key={i} style={{alignSelf:m.role==='user'?'flex-end':'flex-start',maxWidth:'85%',background:m.role==='user'?'#2563eb':'#1c2740',border:m.role==='ai'?'1px solid #23365e':'none',padding:'12px 14px',borderRadius:m.role==='user'?'16px 16px 4px 16px':'16px 16px 16px 4px',fontSize:'13px',lineHeight:'1.5',whiteSpace:'pre-wrap'}}>{m.text}</div>)}
          </div>
          <div style={{padding:'12px',background:'#0f172a',display:'flex',gap:'8px'}}>
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Ej: Quiero ser autónomo pintor con furgoneta..." style={{flex:1,background:'#1e293b',border:'1px solid #334155',borderRadius:'12px',padding:'12px',color:'white',fontSize:'13px'}}/>
            <button onClick={send} style={{background:'linear-gradient(135deg,#22c55e,#16a34a)',border:'none',borderRadius:'12px',padding:'0 20px',fontWeight:'800',color:'black'}}>➤</button>
          </div>
        </div>

        {/* PAYWALL PRO */}
        {!isPremium ? (
        <div style={{marginTop:'16px',background:'linear-gradient(135deg,#f59e0b,#fbbf24)',borderRadius:'20px',padding:'20px',color:'black'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div><div style={{fontWeight:'900',fontSize:'16px'}}>Desbloquear todo por 9,99€</div><div style={{fontSize:'11px',opacity:0.8}}>Pago único • Acceso de por vida</div></div>
            <div style={{fontSize:'28px'}}>🔓</div>
          </div>
          <div style={{margin:'12px 0',fontSize:'12px',lineHeight:'1.6'}}>
            ✓ Modelo 037 relleno PDF<br/>✓ Cálculo neto real Hacienda + RETA<br/>✓ Checklist PRL y seguros<br/>✓ Chat ilimitado
          </div>
          <a href="https://paypal.me/AbogadoBotES/9.99EUR" target="_blank" style={{display:'block',background:'black',color:'white',textAlign:'center',padding:'14px',borderRadius:'12px',textDecoration:'none',fontWeight:'900',letterSpacing:'0.5px'}}>PAGAR 9,99€ CON 【entity-PAYPAL¦canonical_name=PayPal】 →</a>
          <button onClick={()=>setIsPremium(true)} style={{marginTop:'10px',width:'100%',background:'rgba(0,0,0,0.1)',border:'none',padding:'10px',borderRadius:'10px',fontSize:'12px',fontWeight:'700'}}>Ya pagué, activar mi acceso</button>
          <div style={{textAlign:'center',fontSize:'9px',marginTop:'8px',opacity:0.6}}>Pago seguro por 【entity-PayPal¦canonical_name=PayPal】 • Te llega a 【entity-BBVA¦canonical_name=BBVA】 ••1994</div>
        </div>
        ) : (
        <div style={{marginTop:'16px',background:'#16a34a',borderRadius:'16px',padding:'14px',textAlign:'center',fontWeight:'800'}}>✅ Premium Activo - ¡Gracias! Ya puedes descargar todo</div>
        )}

        <div style={{textAlign:'center',color:'#475569',fontSize:'10px',marginTop:'20px'}}>AbogadoBot Gandía • Hecho para autónomos reales • No es asesoría legal oficial</div>
      </div>

      {showPay && <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.85)',display:'flex',justifyContent:'center',alignItems:'center',zIndex:99,padding:'16px'}}>
        <div style={{background:'#121a2c',borderRadius:'20px',padding:'20px',maxWidth:'360px',width:'100%',border:'1px solid #334155',textAlign:'center'}}>
          <div style={{fontSize:'40px'}}>🔒</div>
          <div style={{fontWeight:'800',marginTop:'8px'}}>Has usado los 3 mensajes gratis</div>
          <div style={{fontSize:'12px',color:'#94a3b8',marginTop:'6px'}}>Desbloquea por 9,99€ para seguir y descargar el Modelo 037</div>
          <a href="https://paypal.me/AbogadoBotES/9.99EUR" target="_blank" style={{display:'block',marginTop:'14px',background:'#f59e0b',color:'black',padding:'12px',borderRadius:'12px',textDecoration:'none',fontWeight:'900'}}>PAGAR 9,99€ →</a>
          <button onClick={()=>{setIsPremium(true);setShowPay(false)}} style={{width:'100%',marginTop:'10px',background:'white',border:'none',borderRadius:'10px',padding:'10px',fontWeight:'700'}}>Ya pagué</button>
        </div>
      </div>}
    </div>
  )
}
