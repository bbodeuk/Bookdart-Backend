import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Failure } from '../responses/failure';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch({ message }: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response.status(200).json(new Failure(message));
  }
}
