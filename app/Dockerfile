FROM node:latest

WORKDIR /root/react_app/
ADD ./src ./src/
ADD ./public ./public/
ADD  ./package.json ./package-lock.json ./
RUN npm install --save-exact

EXPOSE 80

ENTRYPOINT ["npm","run","start","&&"]