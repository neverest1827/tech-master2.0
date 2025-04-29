import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface ApiResponse<T> {
    success: boolean;
    data?: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
        const request = context.switchToHttp().getRequest();

        // Проверяем, если это запрос на рендеринг (например, метод GET с типом 'text/html')
        if (request.headers['accept'] && request.headers['accept'].includes('text/html')) {
            return next.handle();
        }

        return next.handle().pipe(
            map((data) => {
                return {
                    success: true,
                    data: data || null,
                };
            }),
        );
    }
}
