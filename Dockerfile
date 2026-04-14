# 第一阶段：构建应用
FROM node:20-alpine AS builder

WORKDIR /app

# 复制 package.json 并安装依赖
COPY package*.json ./
RUN npm install

# 复制 Prisma 结构文件并生成 Prisma Client
COPY prisma ./prisma/
RUN npx prisma generate

# 复制剩余的所有代码并构建
COPY . .
RUN npm run build

# 第二阶段：生产运行环境（剥离开发依赖，减小镜像体积）
FROM node:20-alpine

WORKDIR /app

# 只需要运行所需的文件
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# 暴露给云托管的端口
EXPOSE 80
ENV PORT=80

# 启动 NestJS
CMD ["npm", "run", "start:prod"]