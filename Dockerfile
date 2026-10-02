FROM node:20-alpine
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/. .
EXPOSE 10000
CMD ["npm", "start"]
