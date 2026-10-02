FROM node:20
WORKDIR /app
COPY . .
RUN npm install || true
RUN if [ -d backend ]; then cd backend && npm install; fi
RUN if [ -d frontend ]; then cd frontend && npm install; fi
EXPOSE 10000
CMD ["sh", "-c", "if [ -f backend/server.js ]; then node backend/server.js; else npm start; fi"]
