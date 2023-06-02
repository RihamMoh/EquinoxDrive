FROM node:latest

WORKDIR /root/react_app/
ADD ./src ./src/
ADD ./public ./public/
ADD ./node_modules ./node_modules
ADD  ./package.json ./package-lock.json ./
RUN npm install --save-exact

EXPOSE 3000

ENTRYPOINT ["npm","run","start","&&"]