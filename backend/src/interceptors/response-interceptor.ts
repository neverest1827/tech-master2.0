import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    if (context.getType() !== 'http') return next.handle();

    const request = context.switchToHttp().getRequest();
    const acceptsHtml = request?.headers?.accept?.includes('text/html');
    if (acceptsHtml && request.method === 'GET') return next.handle();

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
