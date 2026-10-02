FROM node:20-alpine
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/. .
COPY ../base_conocimiento_abogados.txt ./base_conocimiento_abogados.txt 2>/dev/null || cp /app/base_conocimiento_abogados.txt ./base_conocimiento_abogados.txt 2>/dev/null || true
EXPOSE 10000
CMD ["npm", "start"]
