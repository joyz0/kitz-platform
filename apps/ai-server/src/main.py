import asyncio
import sys
import os

sys.path.append(os.path.dirname(__file__))

from grpc_server import serve

if __name__ == "__main__":
    asyncio.run(serve())
