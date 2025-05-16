import { NestFactory } from '@nestjs/core';
import { VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v', // 可选，版本前缀如 /v1/users
  });
  app.enableCors({
    origin: ['http://localhost:8081'], // 允许的域名
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // 允许的HTTP方法
    allowedHeaders: 'Content-Type,Authorization', // 允许的请求头
    credentials: true, // 允许携带Cookie
    maxAge: 86400, // 预检请求缓存时间（秒）
  });
  await app.listen(8080);
}
bootstrap();
