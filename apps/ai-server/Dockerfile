# apps/ai-server/Dockerfile
FROM python:3.11-slim

WORKDIR /app

# 复制依赖列表并安装
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 复制 Python 代码本身
COPY . .

# 暴露端口并启动应用
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]
# 注意：生产环境应去掉 `--reload`