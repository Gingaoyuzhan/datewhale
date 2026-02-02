#!/bin/bash
# ============================================
# 启动脚本 - 心灵奇记
# ModelScope 部署入口 (SQLite 版本)
# ============================================

APP_DIR="/home/node/app"

echo "============================================"
echo "心灵奇记 - 启动中..."
echo "============================================"

# 创建必要的目录
mkdir -p ${APP_DIR}/logs ${APP_DIR}/data

# 设置环境变量（优先使用平台注入的值）
export NODE_ENV=production
export PORT=3000
export DB_TYPE=sqlite
export DB_PATH=${APP_DIR}/data/xinling_diary.db
# JWT_SECRET: 优先使用 ModelScope 平台注入的值，否则使用默认值
export JWT_SECRET=${JWT_SECRET:-xinling_diary_jwt_secret_2026}
export JWT_EXPIRES_IN=${JWT_EXPIRES_IN:-7d}
# DASHSCOPE_API_KEY: 保留平台注入的值
export DASHSCOPE_API_KEY=${DASHSCOPE_API_KEY:-}

# 打印当前使用的 JWT_SECRET（用于调试）
echo "当前 JWT_SECRET: ${JWT_SECRET:0:15}..."
echo "当前 DASHSCOPE_API_KEY: ${DASHSCOPE_API_KEY:0:10}..."

# 创建 .env 文件确保 ConfigModule 能读取到正确的值
cat > ${APP_DIR}/backend/.env << EOF
NODE_ENV=production
PORT=3000
DB_TYPE=sqlite
DB_PATH=${APP_DIR}/data/xinling_diary.db
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRES_IN=${JWT_EXPIRES_IN}
DASHSCOPE_API_KEY=${DASHSCOPE_API_KEY}
EOF

echo ".env 文件已创建"

# 启动后端服务（输出到控制台和文件）
echo "启动后端服务..."
cd ${APP_DIR}/backend
node dist/main.js 2>&1 | tee ${APP_DIR}/logs/backend.log &
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
