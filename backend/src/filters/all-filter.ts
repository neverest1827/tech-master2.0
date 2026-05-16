import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from '../logger/logger.service';
import { MetaService } from '../meta/meta.service';
import { Meta } from '../meta/entities/meta.entity';
import { BlogPost } from '../blog/entities/blog-post.entity';
import { BlogService } from '../blog/blog.service';

type ErrorMessage = string | string[];

interface ErrorResponse {
  statusCode: number;
  message: ErrorMessage;
  error?: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly isDev: boolean;

  constructor(
    @Inject(MetaService)
    private readonly metaService: MetaService,
    private readonly blogService: BlogService,
    private readonly logger: LoggerService,
  ) {
    this.isDev = (process.env.NODE_ENV || 'development') !== 'production';
  }

  async catch(exception: unknown, host: ArgumentsHost) {
    if (host.getType() !== 'http') return;

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Нормализуем message в строку
    let message: ErrorMessage = 'Internal server error';
    if (exception instanceof HttpException) {
      const raw = exception.getResponse();
      if (typeof raw === 'object' && raw !== null) {
        const res = raw as ErrorResponse;
        message = res.message ?? (res.error as string) ?? 'Error';
      } else {
        message = raw;
      }
    }
    const messageText = Array.isArray(message) ? message.join(', ') : message;

    const stack = exception instanceof Error ? exception.stack : undefined;

    // Логирование
    const logMsg = `[${request.method}] ${request.url} -> ${messageText}`;
    if (status >= 500) this.logger.error(logMsg, stack);
    else if (status >= 400) this.logger.warn(logMsg);
    else this.logger.log(logMsg);

    const meta: Meta = await this.metaService.getMetaByName(status.toString());
    const blogPosts: BlogPost[] = await this.blogService.findMany([1, 2]);

    const errorData = {
      success: false,
      statusCode: status,
      message: meta.description,
      timestamp: new Date().toISOString(),
      path: request.url,
      env: process.env.NODE_ENV,
      meta,
      blogPosts,
      // Стек только в dev
      ...(this.isDev && stack ? { stack } : {}),
      suggestions: [
        { href: '/', text: 'На главную' },
        { href: '/uslugi', text: 'К услугам' },
        { href: '/blog', text: 'В блог' },
      ],
      scriptName: 'error',
      styleName: 'error',
    };

    if (request.accepts('html'))
      response.status(status).render('error', errorData);
    else response.status(status).json(errorData);
  }
}
