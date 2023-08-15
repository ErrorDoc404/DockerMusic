FROM node:16.18-alpine
WORKDIR /usr/src
COPY . .
RUN npm install
EXPOSE 3000
CMD [ "node", "index.js" ]