FROM node:alpine
WORKDIR /opt/app
ADD package*.json ./
RUN npm install
ADD . .
RUN npm run build
RUN npm prune
CMD ["node", "./dist/main.js"]
