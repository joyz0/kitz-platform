# -*- coding: utf-8 -*-
# 示例：智能客服第一层路由系统

# 1. 定义关键词规则库与对应的MCP操作
# 这里用字典实现，未来可以存入数据库或配置文件中
keyword_rules = [
    {
        "intent": "query_order_status",
        "keywords": ["订单", "订单状态", "我的订单", "order status", "查询订单"],
        "parameters": ["order_id"], # 需要提取的参数
        "mcp_command": "order_service.get_status", # 模拟要调用的MCP服务
        "user_guide": "您想查询订单状态吗？请直接告诉我您的【订单号】。"
    },
    {
        "intent": "query_return_policy",
        "keywords": ["退货", "退款", "怎么退货", "return", "refund"],
        "parameters": [],
        "mcp_command": "policy_service.get_return_policy",
        "user_guide": "您想了解退货政策吗？我们的退货政策是：支持7天无理由退货，请确认商品未拆封使用。您可以直接输入【订单号】为您办理。"
    },
    {
        "intent": "contact_customer_service",
        "keywords": ["人工", "客服", "电话", "联系", "contact", "human"],
        "parameters": [],
        "mcp_command": None, # 没有MCP服务，直接返回指引
        "user_guide": "正在为您转接人工客服，请稍候...（工作时间：9:00-18:00）"
    }
]

# 2. 核心路由函数
def router(user_input):
    """
    处理用户输入的核心路由函数
    返回：要么是MCP服务的调用结果，要么是一条用户指引消息
    """
    user_input_lower = user_input.lower().strip()
    
    # 遍历所有规则，进行关键词匹配
    for rule in keyword_rules:
        for kw in rule['keywords']:
            if kw in user_input_lower:
                print(f"✅ 匹配到意图: {rule['intent']}")
                
                # 检查是否需要提取参数（例如订单号）
                # 这里简单演示，实际可用正则表达式提取
                params = {}
                if 'order_id' in rule['parameters']:
                    # 用一个非常简单的正则来模拟提取数字序列作为订单号
                    import re
                    order_id_match = re.search(r'\d+', user_input)
                    if order_id_match:
                        params['order_id'] = order_id_match.group()
                    else:
                        # 如果没提供订单号，不调用MCP，直接返回指引让其提供
                        return rule['user_guide']
                
                # 如果匹配成功，且有MCP服务，则调用；否则返回指引
                if rule['mcp_command'] is not None:
                    # 这里模拟调用MCP服务，实际中替换为真正的API调用
                    return f"(模拟调用MCP服务: {rule['mcp_command']} 参数: {params})"
                else:
                    return rule['user_guide']
    
    # 3. 如果所有规则都无法匹配，返回通用指引
    return get_general_guide()

# 4. 生成通用用户指引
def get_general_guide():
    """生成一个友好的、指导性的失败回应"""
    general_guide = """
抱歉，我暂时无法处理这个问题。
您可以尝试以下方式：
1. 查询订单状态：请提供您的订单号。
2. 申请退货退款：请说“退货”并提供订单号。
3. 联系人工客服：请说“转人工”。

【未来扩展提示】：此位置可无缝升级为大模型处理接口。
"""
    return general_guide

# 5. 测试样例
if __name__ == '__main__':
    test_cases = [
        "我的订单123456状态怎么样？",
        "我想退货",
        "你们的客服电话是多少？",
        "今天的天气真好", # 无法匹配的查询
    ]
    
    for test in test_cases:
        print(f"用户输入: {test}")
        response = router(test)
        print(f"系统回复: {response}")
        print("-" * 50)