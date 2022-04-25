FROM node:16
WORKDIR /fabian
COPY package.json /
RUN npm i
ADD . /
RUN npm run build
CMD ["npm","start"]