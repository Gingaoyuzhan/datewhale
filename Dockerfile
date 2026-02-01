# ============================================
# 心灵奇记 - ModelScope 创空间部署 Dockerfile
# 关键：必须以 UID 1000 用户运行
# ============================================

FROM python:3.10-slim

# 安装系统依赖
RUN apt-get update && apt-get install -y \
    nginx \
    curl \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

# 安装 Node.js 20.x
RUN npm install -g n && n 20

# 创建 UID 1000 用户（ModelScope 要求）
RUN useradd -m -u 1000 user

# 设置环境变量
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH \
    NODE_ENV=production \
    PORT=3000 \
    DB_TYPE=sqlite \
    DB_PATH=/home/user/app/data/xinling_diary.db \
    JWT_SECRET=xinling_diary_jwt_secret_2026 \
    JWT_EXPIRES_IN=7d

WORKDIR $HOME/app

# 创建必要目录并设置权限
RUN mkdir -p $HOME/app/frontend $HOME/app/backend $HOME/app/data $HOME/app/logs /run/nginx && \
    chown -R user:user $HOME/app /run/nginx /var/lib/nginx /var/log/nginx

# 复制前端文件（必须使用 --chown=user）
COPY --chown=user frontend/package*.json ./frontend/

# 切换到 user 用户
USER user

# 安装前端依赖
RUN cd frontend && npm install --legacy-peer-deps

# 复制前端源码并构建
COPY --chown=user frontend/ ./frontend/
RUN cd frontend && npm run build

# 复制后端文件
COPY --chown=user backend/package*.json ./backend/

# 安装后端依赖
RUN cd backend && npm install

# 复制后端源码并构建
COPY --chown=user backend/ ./backend/
RUN cd backend && npm run build

# 复制配置文件
COPY --chown=user deploy/nginx.conf /etc/nginx/sites-enabled/default
COPY --chown=user deploy/start.sh ./start.sh

# 确保启动脚本可执行
USER root
RUN chmod +x $HOME/app/start.sh && \
    chown -R user:user /etc/nginx /var/lib/nginx /var/log/nginx /run/nginx && \
    rm -f /etc/nginx/sites-enabled/default && \
    ln -s $HOME/app/nginx.conf /etc/nginx/sites-enabled/default 2>/dev/null || true

# 复制 nginx 配置到正确位置
COPY --chown=user deploy/nginx.conf /etc/nginx/conf.d/default.conf

USER user

# 暴露端口
EXPOSE 7860

# 启动命令
CMD ["bash", "./start.sh"]
