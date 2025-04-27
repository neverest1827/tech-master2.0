import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from "../logger/logger.service";

interface ErrorResponse {
    statusCode: number;
    message: string | string[];
    error?: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly isDev: boolean;

    constructor(private readonly logger: LoggerService) {
        this.isDev = process.env.NODE_ENV !== 'prod';
    }

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status: number = exception instanceof HttpException
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        let message: string | string[] = 'Internal server error';

        if (exception instanceof HttpException) {
            const exceptionResponse = exception.getResponse();
            if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
                const res = exceptionResponse as ErrorResponse;
                message = res.message;
            } else {
                message = exceptionResponse;
            }
        }

        const stack: string | undefined = exception instanceof Error ? exception.stack : '';

        // Формируем текст логирования
        const logMessage = `[${request.method}] ${request.url} -> ${JSON.stringify(message)}`;

        // В зависимости от кода статуса выбираем уровень логирования
        if (status >= 500) {
            this.logger.error(
                `[${request.method}] ${request.url} -> ${JSON.stringify(message)}`,
                stack,
            );
        } else if (status >= 400) {
            this.logger.warn(logMessage);
        } else {
            this.logger.log(logMessage);
        }



        const errorData = {
            success: false,
            statusCode: status,
            message,
            timestamp: new Date().toISOString(),
            path: request.url,
            ...(this.isDev && { stack }),
        };

        if (request.accepts('html')) {
            // Если ожидается HTML (браузер)
            if (status === HttpStatus.NOT_FOUND) {
                response.status(status).render('404', errorData);
            } else {
                response.status(status).render('500', errorData);
            }
        } else {
            response.status(status).json(errorData);
        }
    }
}
