from typing import Dict, Any, Optional
import httpx
from pydantic import BaseModel
import logging

logger = logging.getLogger(__name__)


class MCPResponse(BaseModel):
    success: bool
    data: Any
    error: Optional[str] = None


class MCPClient:
    def __init__(self, base_url: str = "http://localhost:8080", timeout: int = 30):
        self.base_url = base_url
        self.timeout = timeout

    async def call(
        self, command: str, parameters: Dict[str, str]
    ) -> MCPResponse:
        try:
            service, method = self._parse_command(command)
            url = f"{self.base_url}/mcp/{service}/{method}"

            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(url, json=parameters)
                response.raise_for_status()
                data = response.json()

                return MCPResponse(success=True, data=data)

        except httpx.HTTPStatusError as e:
            logger.error(f"MCP call failed: {e}")
            return MCPResponse(
                success=False, data=None, error=f"HTTP {e.response.status_code}"
            )
        except Exception as e:
            logger.error(f"MCP call exception: {e}")
            return MCPResponse(success=False, data=None, error=str(e))

    def _parse_command(self, command: str) -> tuple[str, str]:
        parts = command.split(".")
        if len(parts) != 2:
            raise ValueError(f"Invalid MCP command format: {command}")
        return parts[0], parts[1]


mcp_client = MCPClient()
