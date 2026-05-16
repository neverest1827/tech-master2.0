import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';
import { join } from 'path';
import { LoggerService } from './logger/logger.service';
import { ValidationPipe } from '@nestjs/common';
import { getBotToken } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { NextFunction, Request, Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: new LoggerService(),
  });

  const bot = app.get<Telegraf>(getBotToken());
  const webhookPath = process.env.WEBHOOK_PATH || '/bot-webhook';
  app.use(bot.webhookCallback(webhookPath));

  if (process.env.WEBHOOK_DOMAIN) {
    await bot.telegram.setWebhook(`${process.env.WEBHOOK_DOMAIN}${webhookPath}`);
  }

  if (process.env.NODE_ENV === 'dev') {
    console.log('Dev mode: Проксируем статику из Vite');

    app.use(
      '/public',
      createProxyMiddleware({
        target: 'http://localhost:5173',
        changeOrigin: true,
        pathRewrite: { '^/public': '' },
      }),
    );
  } else {
    console.log('Production mode: раздаем статику из билда');

    app.use('/public', express.static(join(__dirname, '..', 'public')));
  }

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.use('/admin', (req: Request, res: Response, next: NextFunction) => {
    const adminUser = process.env.ADMIN_USER;
    const adminPass = process.env.ADMIN_PASS;

    if (!adminUser || !adminPass) {
      res.status(503).send('Admin credentials are not configured');
      return;
    }

    const header = req.headers.authorization;

    if (!header?.startsWith('Basic ')) {
      res.setHeader('WWW-Authenticate', 'Basic realm="Admin"');
      res.status(401).send('Authentication required');
      return;
    }

    const credentials = Buffer.from(header.slice(6), 'base64').toString('utf8');
    const separatorIndex = credentials.indexOf(':');

    if (separatorIndex === -1) {
      res.setHeader('WWW-Authenticate', 'Basic realm="Admin"');
      res.status(401).send('Invalid credentials format');
      return;
    }

    const username = credentials.slice(0, separatorIndex);
    const password = credentials.slice(separatorIndex + 1);

    if (username !== adminUser || password !== adminPass) {
      res.setHeader('WWW-Authenticate', 'Basic realm="Admin"');
      res.status(401).send('Invalid credentials');
      return;
    }

    next();
  });

  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
