import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createProxyMiddleware } from 'http-proxy-middleware';
import {NestExpressApplication} from "@nestjs/platform-express";
import * as express from 'express';
import { join } from 'path';
import {LoggerService} from "./logger/logger.service";
import {ValidationPipe} from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
      AppModule, {
        logger: new LoggerService(),
      }
  );

  if (process.env.NODE_ENV === 'dev') {
    console.log('Dev mode: Проксируем статику из Vite');

    app.use('/public', createProxyMiddleware({
      target: 'http://localhost:5173',
      changeOrigin: true,
      pathRewrite: { '^/public': '' },
    }));
  } else {
    console.log('Production mode: раздаем статику из билда');

    app.use('/public', express.static(join(__dirname, 'public')));
  }

  app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
  );

  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
