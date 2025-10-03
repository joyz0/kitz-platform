from typing import Dict, List, Optional, Any
import re
from pydantic import BaseModel


class KeywordRule(BaseModel):
    intent: str
    keywords: List[str]
    parameters: List[str]
    mcp_command: Optional[str] = None
    user_guide: str


class MatchResult(BaseModel):
    matched: bool
    intent: Optional[str] = None
    matched_keywords: List[str] = []
    parameters: Dict[str, str] = {}
    mcp_command: Optional[str] = None
    user_guide: Optional[str] = None


class KeywordRouter:
    def __init__(self, rules: List[KeywordRule]):
        self.rules = rules

    async def match(self, user_input: str) -> MatchResult:
        user_input_lower = user_input.lower().strip()

        for rule in self.rules:
            matched_kws = []
            for kw in rule.keywords:
                if kw.lower() in user_input_lower:
                    matched_kws.append(kw)
                    break

            if matched_kws:
                params = self._extract_parameters(user_input, rule.parameters)

                if rule.parameters and not all(
                    params.get(p) for p in rule.parameters
                ):
                    return MatchResult(
                        matched=True,
                        intent=rule.intent,
                        matched_keywords=matched_kws,
                        parameters=params,
                        user_guide=rule.user_guide,
                    )

                return MatchResult(
                    matched=True,
                    intent=rule.intent,
                    matched_keywords=matched_kws,
                    parameters=params,
                    mcp_command=rule.mcp_command,
                    user_guide=rule.user_guide,
                )

        return MatchResult(
            matched=False, user_guide=self._get_general_guide()
        )

    def _extract_parameters(
        self, user_input: str, param_names: List[str]
    ) -> Dict[str, str]:
        params = {}

        if "order_id" in param_names:
            order_id_match = re.search(r"\d+", user_input)
            if order_id_match:
                params["order_id"] = order_id_match.group()

        return params

    def _get_general_guide(self) -> str:
        return """抱歉，我暂时无法处理这个问题。
您可以尝试以下方式：
1. 查询订单状态：请提供您的订单号。
2. 申请退货退款：请说"退货"并提供订单号。
3. 联系人工客服：请说"转人工"。

【未来扩展提示】：此位置可无缝升级为大模型处理接口。
"""


default_rules = [
    KeywordRule(
        intent="query_order_status",
        keywords=["订单", "订单状态", "我的订单", "order status", "查询订单"],
        parameters=["order_id"],
        mcp_command="order_service.get_status",
        user_guide="您想查询订单状态吗？请直接告诉我您的【订单号】。",
    ),
    KeywordRule(
        intent="query_return_policy",
        keywords=["退货", "退款", "怎么退货", "return", "refund"],
        parameters=[],
        mcp_command="policy_service.get_return_policy",
        user_guide="您想了解退货政策吗？我们的退货政策是：支持7天无理由退货，请确认商品未拆封使用。您可以直接输入【订单号】为您办理。",
    ),
    KeywordRule(
        intent="contact_customer_service",
        keywords=["人工", "客服", "电话", "联系", "contact", "human"],
        parameters=[],
        mcp_command=None,
        user_guide="正在为您转接人工客服，请稍候...（工作时间：9:00-18:00）",
    ),
]

router = KeywordRouter(default_rules)
