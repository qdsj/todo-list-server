FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# 设置环境变量
ENV DB_HOST
ENV DB_USERNAME
ENV DB_PASSWORD
ENV DB_PORT=3306
ENV DB_DATABASE=todolist
ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/main"]