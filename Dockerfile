FROM node:14.17.6-alpine3.11

WORKDIR /server

COPY package.json package-lock.json ./
RUN npm ci --silent

COPY . .

EXPOSE 8080

CMD ["npm", "start"]

