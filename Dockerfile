FROM node:14.20-alpine

WORKDIR /app

# 拷贝依赖文件
COPY package*.json ./

# 安装依赖
RUN npm install

# 拷贝源代码
COPY . .

# 设置环境变量
ENV NODE_ENV=java_prod_production_demo

# 构建 Nuxt
RUN npm run java:demo

# 暴露端口
EXPOSE 9625

# 启动 Nuxt
CMD ["npm", "run", "java:psdemo"]
