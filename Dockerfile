FROM node:20

WORKDIR /app

RUN apt-get update && apt-get install -y sqlite3

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 3001

CMD sh -c "npx prisma migrate deploy && npm run dev"