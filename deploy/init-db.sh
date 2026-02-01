#!/bin/bash
# ============================================
# 数据库初始化脚本 - 心灵奇记
# ============================================

set -e

# 等待 PostgreSQL 启动
echo "等待 PostgreSQL 启动..."
until pg_isready -h localhost -p 5432 -U postgres; do
    sleep 1
done

echo "PostgreSQL 已启动"

# 检查数据库是否存在
if ! psql -U postgres -lqt | cut -d \| -f 1 | grep -qw xinling_diary; then
    echo "创建数据库 xinling_diary..."
    psql -U postgres -c "CREATE DATABASE xinling_diary;"
    echo "数据库创建成功"
else
    echo "数据库 xinling_diary 已存在"
fi

# 设置密码
psql -U postgres -c "ALTER USER postgres PASSWORD 'postgres123';"

echo "数据库初始化完成"
