FROM node:18.16

WORKDIR /usr/src/app

COPY . .

CMD ["node", "test.js"]
