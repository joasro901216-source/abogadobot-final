import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';

const API_URL = import.meta.env.VITE_API_URL || "https://abogadobot-backend.onrender.com";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isPremium, setIsPremium] = useState(localStorage.getItem('isPremium')==='true');
  const [freeUsed, setFreeUsed] = useState(parseInt(localStorage.getItem('freeUsed')||'0'));
  const [needPay, setNeedPay] = useState(false);
  const [loading, setLoading] = useState(false);

  const generarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Modelo 037 - Alta Autonomos", 20, 20);
    doc.setFontSize(11);
    doc.text("Nombre: _________________________", 20, 40);
    doc.text("NIF: ____________________________", 20, 50);
    doc.text("Actividad: Electricista con furgoneta", 20, 60);
    doc.text("Epigrafe IAE: 504.1 Instalaciones electricas", 20, 70);
    doc.text("Domicilio: ______________________ Gandia", 20, 80);
    doc.text("Fecha alta: " + new Date().toLocaleDateString(), 20, 90);
    doc.text("--- Checklist PRL Autonomo ---", 20, 110);
    doc.text("- Casco, botas seguridad, guantes dielectricos", 20, 120);
    doc.text("- Seguro responsabilidad civil", 20, 130);
    doc.text("- Alta RETA + Modelo 037 presentado", 20, 140);
    doc.text("Generado por AbogadoBot Gandia - Premium 9,99EUR", 20, 160);
    doc.save("Modelo_037_Electricista_Gandia.pdf");
  };

  const sendMessage = async () => {
    if(!input.trim()) return;
    const userMsg = { role:'user', text:input };
    setMessages([...messages, userMsg]);
    setLoading(true);
    try {
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
    } catch(e){
      setMessages(m => [...m, { role:'bot', text: "Error de conexion. Revisa el backend en Render." }]);
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
              Pagar 9,99€ con 【entity-PayPal¦canonical_name=PayPal】
            </a>
            <br/>
            <button onClick={()=>{
              const code = prompt("Pega el ID de transaccion de 【entity-PayPal¦canonical_name=PayPal】:");
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
      {isPremium && <button onClick={generarPDF} style={{marginTop:15, width:'100%', padding:12, background:"green", color:"white", fontWeight:"bold", borderRadius:8}}>📄 Descargar Modelo 037 + Checklist PRL</button>}
    </div>
  );
}
