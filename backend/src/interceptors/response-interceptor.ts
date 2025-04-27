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
        return next.handle().pipe(
            map((data) => {
                // Если данные пустые, можно вернуть просто success: true
                return {
                    success: true,
                    data: data || null,
                };
            }),
        );
    }
}
