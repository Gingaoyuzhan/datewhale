# ============================================
# 心灵奇记 - ModelScope 创空间部署 Dockerfile
# 使用 Alpine 镜像减小体积
# ============================================

FROM node:20-alpine

# 安装系统依赖（Alpine 使用 apk）
RUN apk add --no-cache nginx curl bash

# 设置 npm 使用淘宝镜像
RUN npm config set registry https://registry.npmmirror.com

# node:20-alpine 镜像中 node 用户已经是 UID 1000
# 创建 user 作为 node 的别名（软链接 home 目录）
RUN ln -s /home/node /home/user 2>/dev/null || true

# 设置环境变量
ENV HOME=/home/node \
    PATH=/home/node/.local/bin:/usr/local/bin:$PATH \
    NODE_ENV=production \
    PORT=3000 \
    DB_TYPE=sqlite \
    DB_PATH=/home/node/app/data/xinling_diary.db \
    JWT_SECRET=xinling_diary_jwt_secret_2026 \
    JWT_EXPIRES_IN=7d

WORKDIR /home/node/app

# 创建必要目录并设置权限（使用 node 用户）
RUN mkdir -p /home/node/app/frontend \
             /home/node/app/backend \
             /home/node/app/data \
             /home/node/app/logs \
             /run/nginx && \
    chown -R node:node /home/node/app && \
    chown -R node:node /run/nginx && \
    chown -R node:node /var/lib/nginx && \
    chown -R node:node /var/log/nginx && \
    chown -R node:node /etc/nginx

# 复制 nginx 配置
COPY deploy/nginx.conf /etc/nginx/http.d/default.conf
RUN chown node:node /etc/nginx/http.d/default.conf

# 复制前端 package.json
COPY --chown=node frontend/package*.json ./frontend/

# 切换到 node 用户（UID 1000）
USER node

# 设置 node 用户的 npm 镜像
RUN npm config set registry https://registry.npmmirror.com

# 安装前端依赖（包括 devDependencies 用于构建）
RUN cd frontend && npm install --legacy-peer-deps --include=dev

# 复制前端源码并构建
COPY --chown=node frontend/ ./frontend/
RUN cd frontend && npm run build

# 复制后端 package.json
COPY --chown=node backend/package*.json ./backend/

# 安装后端依赖（包括 devDependencies 用于构建）
RUN cd backend && npm install --include=dev

# 复制后端源码并构建
COPY --chown=node backend/ ./backend/
RUN cd backend && npm run build

# 复制启动脚本
COPY --chown=node deploy/start.sh ./start.sh
RUN chmod +x ./start.sh

# 暴露端口
EXPOSE 7860

# 启动命令
CMD ["bash", "./start.sh"]
