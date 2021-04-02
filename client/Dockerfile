FROM node:12-alpine AS development
WORKDIR /usr/src/client
COPY package*.json ./
RUN npm install --only=development
COPY . .
RUN npm run build
CMD [ "npm", "start" ]

FROM node:12-alpine AS production
ARG NODE_ENV=production
ENV NOVE_ENV=${NODE_ENV}
WORKDIR /usr/src/client
RUN npm install --only=production
COPY . .
COPY --from=development /usr/src/client/dist ./dist
CMD ["node", "dist/main"]