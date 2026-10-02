# AbogadoBot - Guía de despliegue móvil

## Problema POCO M6 Pro / Android
Si descargaste desde Meta AI y te salió .html, es porque Meta envuelve los zips.
Esta página genera ZIP REAL en tu navegador.

## Pasos después de descargar

1. Abre **ZArchiver** (instala de Play Store si no lo tienes)
2. Ve a **Descargas**
3. Mantén pulsado el zip > **Extraer aquí**
4. Te quedarán carpetas `backend` y `frontend`

## Subir a GitHub desde el móvil

1. Ve a github.com y crea repo `abogadobot` (vacío, sin README)
2. Instala app **Spck Editor** o usa **github.com en navegador de escritorio**
3. Sube carpetas:
   - Arrastra `backend` y `frontend` y los archivos raiz
4. En **Render.com**:
   - New + > Blueprint > Conecta tu repo
   - Añade variables de entorno (ver backend/.env.example)
   - Deploy

## Variables necesarias en Render
- DATABASE_URL (crea PostgreSQL en Render, copia Internal URL)
- OPENAI_API_KEY
- STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, STRIPE_PRICE_ID
- JWT_SECRET (cualquier texto largo)
- FRONTEND_URL (la URL que te de Render para frontend)
- VITE_API_URL (la URL del backend)

## Probar local (opcional)
```bash
cd backend && npm install && npm run migrate && npm start
cd frontend && npm install && npm run dev
```

¡Listo! AbogadoBot desplegado.
