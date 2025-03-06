import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createProxyMiddleware } from 'http-proxy-middleware';
import {NestExpressApplication} from "@nestjs/platform-express";
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
      AppModule,
  );

  if (process.env.NODE_ENV === 'dev') {
    console.log('Dev mode: Проксируем статику из Vite');

    // Проксируем запросы на Vite Dev Server
    app.use('/static', createProxyMiddleware({
      target: 'http://localhost:5173',
      changeOrigin: true,
      pathRewrite: { '^/static': '' }, // Убираем /static из пути
    }));
  } else {
    console.log('Production mode: раздаем статику из билда');

    // В продакшене отдаем статику из билда Vite
    app.use('/static', express.static(join(__dirname, 'static')));
  }

  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
