import { NestFactory } from '@nestjs/core';
import { VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { HttpExceptionFilter } from './filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
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
