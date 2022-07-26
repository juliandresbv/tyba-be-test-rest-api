FROM node

RUN mkdir /app
WORKDIR /app
COPY . /app

RUN npm install

CMD ["npm", "run", "start:dev"]
EXPOSE 3000
