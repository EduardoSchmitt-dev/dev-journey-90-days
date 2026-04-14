import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthUser } from '../../auth';
import { RequestWithUser } from '../types/request-with-user';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): AuthUser => {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    return request.user;
  },
);
