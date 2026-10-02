import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();
// En producción usa Postgres
const usersMem = [];

router.post('/register', async (req,res) => {
  const { email, password } = req.body;
  if(usersMem.find(u=>u.email===email)) return res.status(400).json({error:'Ya existe'});
  const hash = await bcrypt.hash(password, 10);
  usersMem.push({ email, hash });
  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token });
});

router.post('/login', async (req,res) => {
  const { email, password } = req.body;
  const user = usersMem.find(u=>u.email===email);
  if(!user) return res.status(404).json({error:'No encontrado'});
  const ok = await bcrypt.compare(password, user.hash);
  if(!ok) return res.status(401).json({error:'Clave incorrecta'});
  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token });
});

export default router;
