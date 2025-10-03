# AI Server

基于关键词匹配的智能路由服务，通过 gRPC 为 api-server 提供 AI 能力。

## 功能特性

- 🔍 关键词匹配引擎
- 🚀 gRPC 高性能通信
- 🔌 MCP 服务调用适配器
- 📦 Docker 容器化部署

## 快速开始

### 1. 安装依赖

```bash
pip install -r requirements.txt
```

### 2. 生成 gRPC 代码

```bash
make proto
```

### 3. 启动服务

```bash
# 开发模式（自动生成 proto）
make dev

# 生产模式
make start
```

### 4. 测试路由引擎

```bash
make test
```

### 5. 其他命令

```bash
make lint      # 代码检查
make format    # 代码格式化
make clean     # 清理生成文件
make help      # 查看所有命令
```

## gRPC 接口

### ProcessChat

处理用户聊天消息

**Request:**
```json
{
  "user_id": "user123",
  "message": "我的订单123456状态怎么样？",
  "session_id": "session123"
}
```

**Response:**
```json
{
  "reply": "✅ 已为您查询，结果：...",
  "intent": "query_order_status",
  "mcp_command": "order_service.get_status",
  "parameters": {"order_id": "123456"},
  "matched": true
}
```

### MatchKeyword

仅匹配关键词，不调用 MCP 服务

### TestRule

测试规则匹配效果

## 关键词规则配置

在 `src/keyword_router.py` 中配置:

```python
KeywordRule(
    intent="query_order_status",
    keywords=["订单", "订单状态", "我的订单"],
    parameters=["order_id"],
    mcp_command="order_service.get_status",
    user_guide="您想查询订单状态吗？请直接告诉我您的【订单号】。"
)
```

## Docker 部署

```bash
docker build -t ai-server .
docker run -p 50051:50051 ai-server
```

## 与 api-server 集成

api-server 通过 gRPC 调用 ai-server:

```typescript
// apps/api-server/src/ai/ai.service.ts
const response = await this.aiService.processChat(userId, message);
```

## 环境变量

```bash
MCP_BASE_URL=http://localhost:8080  # MCP 服务地址
GRPC_PORT=50051                     # gRPC 监听端口
LOG_LEVEL=INFO                      # 日志级别
```

## 扩展开发

### 添加新的关键词规则

在 `default_rules` 数组中添加:

```python
KeywordRule(
    intent="new_intent",
    keywords=["关键词1", "关键词2"],
    parameters=["param1"],
    mcp_command="service.method",
    user_guide="提示信息"
)
```

### 自定义参数提取

在 `KeywordRouter._extract_parameters` 方法中添加逻辑:

```python
if "custom_param" in param_names:
    match = re.search(r"pattern", user_input)
    if match:
        params["custom_param"] = match.group()
```

### 集成大模型

在 `KeywordRouter.match` 中添加 LLM 降级:

```python
if not matched:
    return await llm_service.process(user_input)
```

## 项目结构

```
apps/ai-server/
├── proto/
│   └── ai_service.proto      # gRPC 接口定义
├── src/
│   ├── main.py               # 入口文件
│   ├── grpc_server.py        # gRPC 服务实现
│   ├── keyword_router.py     # 关键词路由引擎
│   ├── mcp_client.py         # MCP 客户端
│   └── test_router.py        # 测试脚本
├── requirements.txt
├── Dockerfile
└── package.json
```
