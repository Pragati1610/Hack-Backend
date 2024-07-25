FROM node:20.15.1-alpine3.20

WORKDIR /server

COPY package.json package-lock.json ./
RUN npm ci --silent

COPY . .

EXPOSE 8080

CMD ["npm", "start"]

