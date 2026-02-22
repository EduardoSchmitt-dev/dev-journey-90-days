import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthUser } from '../../auth'; 

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): AuthUser => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);
