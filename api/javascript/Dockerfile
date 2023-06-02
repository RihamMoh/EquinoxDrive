FROM node:latest

ADD ./api /root/react_app/api/
ADD ./config.json /root/react_app/
WORKDIR /root/react_app/api/
ADD ./api/node_modules ./node_modules
RUN npm install --save-exact

EXPOSE 8008
EXPOSE 9999

ENTRYPOINT ["npm","run","start","&&"]

