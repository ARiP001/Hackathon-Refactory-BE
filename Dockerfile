FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# COPY kode sumber setelah install dependencies agar build cache maksimal
COPY . .

EXPOSE 5000

CMD ["node", "index.js"]
