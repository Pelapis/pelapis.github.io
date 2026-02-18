# 使用 Node.js 基础镜像
FROM oven/bun

# 设置工作目录
WORKDIR /home/user/page_man

# 复制所有源代码
COPY . .

# 启动 shell
CMD ["sh"]