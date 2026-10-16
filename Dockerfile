FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
COPY prisma.config.ts ./

# URL temporária apenas para gerar o cliente Prisma.
# A URL real será fornecida quando o container executar.
RUN DIRECT_URL=postgresql://placeholder:placeholder@localhost:5432/placeholder npx prisma generate

COPY src ./src

EXPOSE 3000

CMD ["npm", "start"]