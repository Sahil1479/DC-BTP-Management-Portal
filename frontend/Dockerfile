# build stage
FROM node:16-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm update
COPY . .
EXPOSE 3000
CMD ["npm", "start"]