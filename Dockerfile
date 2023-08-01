FROM node:18.16.0

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4000

ENV NODE_ENV=development

CMD ["npm", "run", "dev"]
