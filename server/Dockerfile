FROM node:16
WORKDIR /fabian
COPY package.json /
RUN npm i
ADD . /
CMD ["npm","start"]