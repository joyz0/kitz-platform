import grpc
from concurrent import futures
import logging
import sys
import os

sys.path.append(os.path.dirname(__file__))

import ai_service_pb2
import ai_service_pb2_grpc
from keyword_router import router
from mcp_client import mcp_client

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class AIServiceServicer(ai_service_pb2_grpc.AIServiceServicer):
    async def ProcessChat(self, request, context):
        try:
            logger.info(
                f"ProcessChat called: user_id={request.user_id}, message={request.message}"
            )

            match_result = await router.match(request.message)

            if match_result.matched and match_result.mcp_command:
                mcp_response = await mcp_client.call(
                    match_result.mcp_command, match_result.parameters
                )

                if mcp_response.success:
                    reply = f"✅ 已为您查询，结果：{mcp_response.data}"
                else:
                    reply = f"❌ 服务调用失败：{mcp_response.error}"
            else:
                reply = match_result.user_guide or "无法理解您的请求"

            return ai_service_pb2.ChatResponse(
                reply=reply,
                intent=match_result.intent or "",
                mcp_command=match_result.mcp_command or "",
                parameters=match_result.parameters,
                matched=match_result.matched,
            )

        except Exception as e:
            logger.error(f"ProcessChat error: {e}")
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(str(e))
            return ai_service_pb2.ChatResponse(
                reply=f"系统错误：{str(e)}",
                matched=False,
            )

    async def MatchKeyword(self, request, context):
        try:
            match_result = await router.match(request.message)

            return ai_service_pb2.KeywordResponse(
                intent=match_result.intent or "",
                matched_keywords=match_result.matched_keywords,
                parameters=match_result.parameters,
                matched=match_result.matched,
                user_guide=match_result.user_guide or "",
            )

        except Exception as e:
            logger.error(f"MatchKeyword error: {e}")
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(str(e))
            return ai_service_pb2.KeywordResponse(matched=False)

    async def TestRule(self, request, context):
        try:
            import json

            rule_dict = json.loads(request.rule_json)

            from keyword_router import KeywordRule, KeywordRouter

            rule = KeywordRule(**rule_dict)
            test_router = KeywordRouter([rule])
            match_result = await test_router.match(request.message)

            return ai_service_pb2.TestRuleResponse(
                matched=match_result.matched,
                extracted_params=match_result.parameters,
                debug_info=f"Intent: {match_result.intent}, Keywords: {match_result.matched_keywords}",
            )

        except Exception as e:
            logger.error(f"TestRule error: {e}")
            return ai_service_pb2.TestRuleResponse(
                matched=False,
                extracted_params={},
                debug_info=f"Error: {str(e)}",
            )


async def serve():
    server = grpc.aio.server(futures.ThreadPoolExecutor(max_workers=10))
    ai_service_pb2_grpc.add_AIServiceServicer_to_server(
        AIServiceServicer(), server
    )

    listen_addr = "127.0.0.1:50051"
    server.add_insecure_port(listen_addr)

    logger.info(f"Starting gRPC server on {listen_addr}")
    await server.start()
    await server.wait_for_termination()


if __name__ == "__main__":
    import asyncio

    asyncio.run(serve())
