FROM node:12-alpine AS development
WORKDIR /usr/src/server
COPY package*.json ./
RUN npm install --only=development
COPY . .
RUN npm run build

FROM node:12-alpine AS production
ARG NODE_ENV=production
ENV NOVE_ENV=${NODE_ENV}
WORKDIR /usr/src/server
RUN npm install --only=production
COPY . .
COPY --from=development /usr/src/server/dist ./dist
CMD ["node", "dist/main"]