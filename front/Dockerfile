FROM node:stretch

WORKDIR /app

COPY package.json . 
COPY package-lock.json .

RUN npm install

CMD ["npm", "run", "start"]

