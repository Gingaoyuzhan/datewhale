# ============================================
# 心灵奇记 - ModelScope 部署 Dockerfile
# 使用 Alpine 镜像避免 Debian GPG 问题
# ============================================

FROM node:20-alpine

# 安装 nginx 和 curl
RUN apk add --no-cache nginx curl bash

WORKDIR /home/user/app

# 复制前端文件并构建
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install --legacy-peer-deps

COPY frontend/ ./frontend/
RUN cd frontend && npm run build

# 复制后端文件并构建
COPY backend/package*.json ./backend/
RUN cd backend && npm install

COPY backend/ ./backend/
RUN cd backend && npm run build

# 复制配置文件
COPY deploy/nginx.conf /etc/nginx/http.d/default.conf
COPY deploy/start.sh /home/user/app/start.sh

# 创建数据目录并设置权限
RUN mkdir -p /home/user/app/logs /home/user/app/data /run/nginx && \
    chmod +x /home/user/app/start.sh && \
    chmod -R 777 /home/user/app/data && \
    chmod -R 777 /home/user/app/logs

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=3000
ENV DB_TYPE=sqlite
ENV DB_PATH=/home/user/app/data/xinling_diary.db
ENV JWT_SECRET=xinling_diary_jwt_secret_2026
ENV JWT_EXPIRES_IN=7d

EXPOSE 7860

CMD ["/home/user/app/start.sh"]
