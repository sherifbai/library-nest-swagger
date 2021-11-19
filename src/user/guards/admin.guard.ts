import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ExpressRequestInterface } from '../../types/expressRequest.interface';

export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<ExpressRequestInterface>();

    if (req.user.role === true) {
      return true;
    }

    throw new HttpException('You are not admin', HttpStatus.FORBIDDEN);
  }
}
