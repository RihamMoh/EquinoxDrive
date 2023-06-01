FROM node:latest

WORKDIR /root/react_app/
ADD ./src ./src/
ADD ./public ./public/
ADD ./node_modules ./node_modules/
ADD  ./package.json ./package-lock.json ./

EXPOSE 80

ENTRYPOINT ["npm","run","start","&&"]