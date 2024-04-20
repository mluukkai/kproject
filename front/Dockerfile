FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV port=3000

EXPOSE 3000

CMD [ "node", "index.js" ]

# TAG=3 && docker build -t mluukkai/todo-app:$TAG . && docker push mluukkai/todo-app:$TAG
