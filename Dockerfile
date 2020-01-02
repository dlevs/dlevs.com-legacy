FROM node:12.14.0-alpine as build
RUN mkdir /home/node/build && chown -R node:node /home/node/build
WORKDIR /home/node/build
USER node
COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src
RUN npm ci
RUN npm run build

FROM node:12.14.0-alpine as base-app
RUN mkdir /home/node/app && chown -R node:node /home/node/app
WORKDIR /home/node/app
ENV PATH=$PATH:/home/node/app/node_modules/.bin
USER node
COPY package*.json ./
EXPOSE $PORT

FROM base-app as dev-app
RUN npm ci
# COPY src ./src
COPY tsconfig.json ./
CMD [ \
	"nodemon", \
	"--ext", "js,ts", \
	"--ignore", "publicSrc/", \
	"--ignore", "public/", \
	"-r", "ts-node/register", \
	"-r", "tsconfig-paths/register", \
	"src/index.ts" ]

FROM base-app as prod-app
COPY --from=build /build/dist ./dist
RUN npm ci --production
CMD ["node", "dist/index.js"]
