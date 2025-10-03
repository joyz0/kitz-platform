.PHONY: install proto dev start test lint clean

install:
	pip install -r requirements.txt

proto:
	python -m grpc_tools.protoc -I./proto --python_out=./src --grpc_python_out=./src ./proto/ai_service.proto

dev: proto
	python src/main.py

start:
	python src/main.py

test:
	python src/test_router.py

test-pytest:
	pytest tests/

lint:
	ruff check src/

format:
	ruff format src/

clean:
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete
	find . -type f -name "*.pyo" -delete
	find . -type f -name "*_pb2.py" -delete
	find . -type f -name "*_pb2_grpc.py" -delete

help:
	@echo "Available commands:"
	@echo "  make install      - Install Python dependencies"
	@echo "  make proto        - Generate gRPC protobuf code"
	@echo "  make dev          - Start development server (with proto generation)"
	@echo "  make start        - Start production server"
	@echo "  make test         - Run router tests"
	@echo "  make test-pytest  - Run pytest tests"
	@echo "  make lint         - Run ruff linter"
	@echo "  make format       - Format code with ruff"
	@echo "  make clean        - Remove generated files and cache"
	@echo "  make help         - Show this help message"
