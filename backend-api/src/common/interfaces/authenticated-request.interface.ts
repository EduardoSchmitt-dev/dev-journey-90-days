import { Request } from 'express';
import { AuthUser } from '../../auth/interfaces/auth-user.interface';

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}
