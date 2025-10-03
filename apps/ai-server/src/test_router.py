import asyncio
import sys
import os

sys.path.append(os.path.dirname(__file__))

from keyword_router import router


async def test_cases():
    test_inputs = [
        "我的订单123456状态怎么样？",
        "我想退货",
        "你们的客服电话是多少？",
        "今天的天气真好",
    ]

    for test in test_inputs:
        print(f"\n用户输入: {test}")
        result = await router.match(test)
        print(f"匹配结果: {result.model_dump()}")
        print("-" * 50)


if __name__ == "__main__":
    asyncio.run(test_cases())
