import { useState } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function App(){
  const [msg,setMsg]=useState('');
  const [chat,setChat]=useState([{role:'bot', text:'¡Hola! Soy AbogadoBot. Cuéntame tu caso de extranjería en España.'}]);
  const [loading,setLoading]=useState(false);
  const [contexto,setContexto]=useState({ aniosResidencia:1, contrato:'temporal', ingresos:12000, arraigo:false });

  async function send(){
    if(!msg.trim()) return;
    const userMsg = { role:'user', text: msg };
    setChat(c=>[...c,userMsg]);
    setMsg('');
    setLoading(true);
    try{
      const res = await fetch(`${API}/api/chat`,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ message: userMsg.text, contexto })
      });
      const data = await res.json();
      setChat(c=>[...c,{ role:'bot', text: data.reply, reta: data.reta }]);
    }catch(e){
      setChat(c=>[...c,{ role:'bot', text:'Error conectando al backend: '+e.message }]);
    }
    setLoading(false);
  }

  return (
    <div style={{maxWidth:760, margin:'0 auto', padding:16}}>
      <h1 style={{fontSize:24, fontWeight:800}}>⚖️ AbogadoBot</h1>
      <p style={{opacity:0.7, margin:'8px 0 16px'}}>Tu asistente de extranjería - Motor RETA</p>
      
      <div style={{background:'#15151e', borderRadius:12, padding:12, marginBottom:12, display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
        <label>Años residencia <input type="number" value={contexto.aniosResidencia} onChange={e=>setContexto({...contexto, aniosResidencia: Number(e.target.value)})} style={{width:'100%'}} /></label>
        <label>Contrato 
          <select value={contexto.contrato} onChange={e=>setContexto({...contexto, contrato: e.target.value})} style={{width:'100%'}}>
            <option value="temporal">Temporal</option><option value="indefinido">Indefinido</option><option value="sin">Sin contrato</option>
          </select>
        </label>
      </div>

      <div style={{background:'#111119', border:'1px solid #222', borderRadius:16, minHeight:380, padding:12, display:'flex', flexDirection:'column'}}>
        <div style={{flex:1, overflowY:'auto', display:'flex', flexDirection:'column', gap:10}}>
          {chat.map((m,i)=>(
            <div key={i} style={{alignSelf: m.role==='user'?'flex-end':'flex-start', background: m.role==='user'?'#2563eb':'#1f1f2a', padding:'10px 14px', borderRadius:14, maxWidth:'85%'}}>
              <div style={{whiteSpace:'pre-wrap'}}>{m.text}</div>
              {m.reta && <div style={{marginTop:8, fontSize:12, background:'#0005', padding:6, borderRadius:8}}>
                RETA: {m.reta.score}/100 - {m.reta.viabilidad} <br/>{m.reta.detalles?.join(' • ')}
              </div>}
            </div>
          ))}
          {loading && <div style={{opacity:0.6}}>AbogadoBot escribiendo...</div>}
        </div>
        <div style={{display:'flex', gap:8, marginTop:12}}>
          <input value={msg} onChange={e=>setMsg(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Escribe tu consulta..." style={{flex:1, padding:'12px', borderRadius:12, border:'1px solid #333', background:'#0f0f15', color:'#fff'}} />
          <button onClick={send} disabled={loading} style={{background:'#22c55e', color:'#000', fontWeight:700, padding:'0 18px', borderRadius:12, border:0}}>Enviar</button>
        </div>
      </div>
    </div>
  )
}
