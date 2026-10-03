import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || "https://abogadobot-backend.onrender.com";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isPremium, setIsPremium] = useState(localStorage.getItem('isPremium')==='true');
  const [freeUsed, setFreeUsed] = useState(parseInt(localStorage.getItem('freeUsed')||'0'));
  const [needPay, setNeedPay] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if(!input.trim()) return;
    const userMsg = { role:'user', text:input };
    setMessages([...messages, userMsg]);
    setLoading(true);

    const res = await fetch(`${API_URL}/api/chat`, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ message: input, isPremium, freeUsed })
    });
    const data = await res.json();
    
    setMessages(m => [...m, { role:'bot', text: data.reply }]);
    setNeedPay(data.needPay);
    
    if(!isPremium){
      const newCount = freeUsed + 1;
      setFreeUsed(newCount);
      localStorage.setItem('freeUsed', newCount);
    }
    setInput("");
    setLoading(false);
  };

  return (
    <div style={{maxWidth:600, margin:'0 auto', padding:20, fontFamily:'sans-serif'}}>
      <h1>AbogadoBot Gandía ⚖️ {isPremium?'👑':''}</h1>
      <p>Consultas gratis usadas: {freeUsed}/2 {isPremium && '(Premium activo)'}</p>
      
      <div style={{border:'1px solid #ccc', height:400, overflowY:'auto', padding:10, marginBottom:10}}>
        {messages.map((m,i)=>(
          <div key={i} style={{margin:'10px 0', textAlign: m.role==='user'?'right':'left'}}>
            <b>{m.role==='user'?'Tú':'Bot'}:</b> {m.text}
          </div>
        ))}
        {loading && <p>Escribiendo...</p>}
        
        {needPay && !isPremium && (
          <div style={{background:"#FFC439", padding:16, borderRadius:12, textAlign:"center", marginTop:20}}>
            <p><b>🔒 Has usado tus 2 consultas gratis</b></p>
            <p>Desbloquea Premium 9,99€ para chat ilimitado + PDFs</p>
            <a href="https://paypal.me/AbogadoBotES/9.99EUR" target="_blank" style={{background:"#0070BA", color:"white", padding:"12px 24px", borderRadius:"8px", textDecoration:"none", fontWeight:"bold", display:"inline-block", margin:"10px 0"}}>
              Pagar 9,99€ con PayPal
            </a>
            <br/>
            <button onClick={()=>{
              const code = prompt("Pega el ID de PayPal:");
              if(code){
                localStorage.setItem("isPremium","true");
                setIsPremium(true);
                setNeedPay(false);
                alert("¡Premium desbloqueado! ✅");
              }
            }} style={{marginTop:10, background:"black", color:"white", padding:"8px 16px", borderRadius:"6px"}}>
              Ya pagué - Desbloquear
            </button>
          </div>
        )}
      </div>

      <div style={{display:'flex', gap:10}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendMessage()} placeholder="Escribe: soy electricista..." style={{flex:1, padding:10}} />
        <button onClick={sendMessage} disabled={needPay && !isPremium} style={{padding:'10px 20px'}}>Enviar</button>
      </div>
      {isPremium && <button style={{marginTop:10, width:'100%', padding:10, background:"green", color:"white"}}>📄 Descargar PDFs Modelo 037</button>}
    </div>
  );
}
