FROM node:6.10-alpine

RUN npm install

WORKDIR /app

#CMD ["npm", "run", "dev"]