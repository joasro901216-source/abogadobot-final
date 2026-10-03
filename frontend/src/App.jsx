import { useState } from 'react'
const PROFESIONES = [
  {id:'505', label:'Pintor', kw:['pintor']},
  {id:'731', label:'Abogado', kw:['abogado']},
  {id:'651', label:'Tienda', kw:['tienda']},
]
export default function App(){
  const [tab,setTab]=useState('guia')
  const [isPremium,setIsPremium]=useState(false)
  const [showPay,setShowPay]=useState(false)
  const [input,setInput]=useState('')
  const [chat,setChat]=useState([])
  return(
    <div style={{minHeight:'100vh',background:'#0a1020',color:'white',display:'flex',justifyContent:'center',padding:'12px',fontFamily:'system-ui'}}>
      <div style={{width:'100%',maxWidth:'600px'}}>
        <h1 style={{fontSize:'22px',fontWeight:'800'}}>AbogadoBot - Gandia <span style={{background:isPremium?'#16a34a':'#f59e0b',fontSize:'10px',padding:'4px 8px',borderRadius:'8px',marginLeft:'6px'}}>{isPremium?'PREMIUM':'9,99 PREMIUM'}</span></h1>
        
        <div style={{display:'flex',gap:'6px',margin:'12px 0'}}>
          <button onClick={()=>setTab('guia')} style={{flex:1,padding:'10px',borderRadius:'10px',border:'none',background:tab==='guia'?'#2563eb':'#1e293b',color:'white'}}>IA</button>
          <button onClick={()=>setTab('calc')} style={{flex:1,padding:'10px',borderRadius:'10px',border:'none',background:tab==='calc'?'#2563eb':'#1e293b',color:'white'}}>Calculadora</button>
        </div>

        <div style={{background:'#162032',borderRadius:'16px',padding:'14px',border:'1px solid #2a3a55'}}>
          <div style={{maxHeight:'300px',overflowY:'auto',marginBottom:'10px'}}>
            {chat.map((m,i)=><div key={i} style={{background:m.role==='user'?'#2563eb':'#0f172a',padding:'8px 12px',borderRadius:'10px',marginBottom:'6px',fontSize:'13px'}}>{m.text}</div>)}
            {chat.length===0 && <div style={{color:'#94a3b8',fontSize:'12px'}}>Escribe tu profesion, ej: soy pintor</div>}
          </div>
          <div style={{display:'flex',gap:'6px'}}>
            <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Ej: quiero ser autonomo pintor" style={{flex:1,background:'#0f172a',border:'1px solid #334155',borderRadius:'8px',padding:'10px',color:'white'}}/>
            <button onClick={()=>{if(!input)return; if(!isPremium&&chat.length>=2){setShowPay(true);return} setChat([...chat,{role:'user',text:input},{role:'ai',text:'IAE 505 Pintor - Modelo 037 + RETA 80 euros + Seguro RC. '+(isPremium?'Te genero el modelo.':'Desbloquea 9.99 para el modelo.')} ]); setInput('')}} style={{background:'#22c55e',border:'none',borderRadius:'8px',padding:'0 16px',fontWeight:'800'}}>Enviar</button>
          </div>
        </div>

        {!isPremium && <div style={{marginTop:'14px',background:'#f59e0b',borderRadius:'12px',padding:'14px'}}>
          <div style={{color:'black',fontWeight:'800',fontSize:'14px'}}>Desbloquear Premium - 9,99 pago unico</div>
          <a href="https://paypal.me/AbogadoBotES/9.99EUR" target="_blank" style={{display:'block',textAlign:'center',background:'black',color:'white',padding:'12px',borderRadius:'10px',textDecoration:'none',fontWeight:'800',marginTop:'8px'}}>PAGAR 9,99 CON 【entity-PAYPAL¦canonical_name=PAYPAL】</a>
          <button onClick={()=>setIsPremium(true)} style={{marginTop:'8px',width:'100%',background:'white',border:'none',borderRadius:'8px',padding:'8px',fontSize:'11px'}}>Ya pague, activar</button>
        </div>}

        {isPremium && <div style={{marginTop:'14px',background:'#16a34a',borderRadius:'12px',padding:'12px',textAlign:'center',fontWeight:'800'}}>Premium Activo - Gracias!</div>}
      </div>

      {showPay && <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.85)',display:'flex',justifyContent:'center',alignItems:'center',padding:'16px'}}>
        <div style={{background:'#162032',borderRadius:'16px',padding:'18px',maxWidth:'340px',width:'100%',textAlign:'center'}}>
          <div style={{fontWeight:'800'}}>Limite gratis alcanzado</div>
          <a href="https://paypal.me/AbogadoBotES/9.99EUR" target="_blank" style={{display:'block',background:'#0070BA',color:'white',padding:'12px',borderRadius:'10px',textDecoration:'none',fontWeight:'800',marginTop:'12px'}}>Pagar 9,99 con PayPal</a>
          <button onClick={()=>{setIsPremium(true); setShowPay(false)}} style={{width:'100%',marginTop:'8px',background:'white',borderRadius:'8px',padding:'10px',border:'none'}}>Ya pague</button>
          <button onClick={()=>setShowPay(false)} style={{marginTop:'8px',background:'transparent',border:'none',color:'#64748b'}}>Cerrar</button>
        </div>
      </div>}
    </div>
  )
}
