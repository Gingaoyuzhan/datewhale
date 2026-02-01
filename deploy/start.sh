#!/bin/bash
# ============================================
# 启动脚本 - 心灵奇记
# ModelScope 部署入口 (SQLite 版本)
# ============================================

APP_DIR="/home/user/app"

echo "============================================"
echo "心灵奇记 - 启动中..."
echo "============================================"

# 创建必要的目录
mkdir -p ${APP_DIR}/logs ${APP_DIR}/data

# 设置环境变量
export NODE_ENV=production
export PORT=3000
export DB_TYPE=sqlite
export DB_PATH=${APP_DIR}/data/xinling_diary.db
export JWT_SECRET=xinling_diary_jwt_secret_2026
export JWT_EXPIRES_IN=7d

# 启动后端服务
echo "启动后端服务..."
cd ${APP_DIR}/backend
node dist/main.js > ${APP_DIR}/logs/backend.log 2>&1 &
BACKEND_PID=$!

# 等待后端启动
echo "等待后端服务就绪..."
sleep 5
for i in $(seq 1 30); do
    if curl -s http://localhost:3000/api > /dev/null 2>&1; then
        echo "后端服务已就绪"
        break
    fi
    if ! kill -0 $BACKEND_PID 2>/dev/null; then
        echo "后端服务启动失败，查看日志："
        cat ${APP_DIR}/logs/backend.log
        exit 1
    fi
    echo "等待后端... ($i/30)"
    sleep 1
done

# 启动 Nginx
echo "启动 Nginx..."
nginx -g "daemon off;" &
NGINX_PID=$!

echo "============================================"
echo "心灵奇记 - 启动完成!"
echo "访问端口: 7860"
echo "============================================"

# 监控进程
while true; do
    if ! kill -0 $BACKEND_PID 2>/dev/null; then
        echo "后端服务异常退出，重启中..."
        cd ${APP_DIR}/backend
        node dist/main.js > ${APP_DIR}/logs/backend.log 2>&1 &
        BACKEND_PID=$!
    fi
    if ! kill -0 $NGINX_PID 2>/dev/null; then
        echo "Nginx 异常退出，重启中..."
        nginx -g "daemon off;" &
        NGINX_PID=$!
    fi
    sleep 5
done
