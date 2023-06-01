FROM node:latest

ADD ./api /root/react_app/api/
ADD ./config.json /root/react_app/
WORKDIR /root/react_app/api/
RUN npm install --save-exact

EXPOSE 8390
EXPOSE 99

ENTRYPOINT ["npm","run","start","&&"]

