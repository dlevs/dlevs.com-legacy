FROM node:8.11.4-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

USER node

RUN npm install --ignore-scripts

COPY --chown=node:node . .

EXPOSE 3000

CMD [ "node", "index.js" ]
