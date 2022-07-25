import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';

export class CookieInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<null> | Promise<Observable<null>> {
    const req = context.switchToHttp().getRequest() as Request;
    const res = context.switchToHttp().getResponse() as Response;

    if (!req.cookies.isRefresh) {
      return next.handle();
    }

    res.cookie('access-token', req.cookies['access-token']);
    res.cookie('refresh-token', req.cookies['refresh-token']);

    return next.handle();
  }
}
