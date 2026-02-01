# ============================================
# 心灵奇记 - ModelScope 创空间部署 Dockerfile
# 使用 Alpine 镜像减小体积
# ============================================

FROM node:20-alpine

# 安装系统依赖（Alpine 使用 apk）
RUN apk add --no-cache nginx curl bash

# 设置 npm 使用淘宝镜像
RUN npm config set registry https://registry.npmmirror.com

# 创建 UID 1000 用户（ModelScope 要求）
# Alpine 默认的 node 用户就是 UID 1000
RUN adduser -D -u 1000 user 2>/dev/null || true

# 设置环境变量
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:/usr/local/bin:$PATH \
    NODE_ENV=production \
    PORT=3000 \
    DB_TYPE=sqlite \
    DB_PATH=/home/user/app/data/xinling_diary.db \
    JWT_SECRET=xinling_diary_jwt_secret_2026 \
    JWT_EXPIRES_IN=7d

WORKDIR /home/user/app

# 创建必要目录并设置权限
RUN mkdir -p /home/user/app/frontend \
             /home/user/app/backend \
             /home/user/app/data \
             /home/user/app/logs \
             /run/nginx && \
    chown -R user:user /home/user/app && \
    chown -R user:user /run/nginx && \
    chown -R user:user /var/lib/nginx && \
    chown -R user:user /var/log/nginx && \
    chown -R user:user /etc/nginx

# 复制 nginx 配置
COPY deploy/nginx.conf /etc/nginx/http.d/default.conf
RUN chown user:user /etc/nginx/http.d/default.conf

# 复制前端 package.json
COPY --chown=user frontend/package*.json ./frontend/

# 切换到 user 用户
USER user

# 设置 user 的 npm 镜像
RUN npm config set registry https://registry.npmmirror.com

# 安装前端依赖
RUN cd frontend && npm install --legacy-peer-deps

# 复制前端源码并构建
COPY --chown=user frontend/ ./frontend/
RUN cd frontend && npm run build

# 复制后端 package.json
COPY --chown=user backend/package*.json ./backend/

# 安装后端依赖
RUN cd backend && npm install

# 复制后端源码并构建
COPY --chown=user backend/ ./backend/
RUN cd backend && npm run build

# 复制启动脚本
COPY --chown=user deploy/start.sh ./start.sh
RUN chmod +x ./start.sh

# 暴露端口
EXPOSE 7860

# 启动命令
CMD ["bash", "./start.sh"]
