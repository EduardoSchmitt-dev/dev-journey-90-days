import { 
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
}   from '@nestjs/common'
import { Observable, map, timestamp } from 'rxjs';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, any>
  {

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable <any> {
    return next.handle().pipe(
      map((data) => ({
        sucess: true,
        data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
