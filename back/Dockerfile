FROM node:stretch

WORKDIR /api

COPY package.json . 
COPY package-lock.json .

RUN npm install

CMD ["npm", "run", "start"]

