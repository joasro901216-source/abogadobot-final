const freeUsed = parseInt(localStorage.getItem('freeUsed')||'0');
const isPremium = localStorage.getItem('isPremium')==='true';

fetch(`${API_URL}/api/chat`, {
  method:'POST',
  headers:{'Content-Type':'application/json'},
  body: JSON.stringify({ message, isPremium, freeUsed })
}).then(r=>r.json()).then(data=>{
  if(!isPremium) {
    localStorage.setItem('freeUsed', freeUsed+1);
  }
  // si data.needPay=true muestras tu cajita amarilla de 9,99€
})
