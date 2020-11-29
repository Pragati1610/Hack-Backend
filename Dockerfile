FROM node:lts-alpine

WORKDIR /server

COPY package.json package-lock.json ./
RUN npm ci --silent

COPY . .

EXPOSE 8080

CMD ["npm", "start"]

