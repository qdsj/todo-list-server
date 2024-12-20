import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import ClientErrorException from 'src/exception/clientErrorException';

@Catch(ClientErrorException)
export class ClientErrorFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    // const request = ctx.getRequest();

    if (exception instanceof ClientErrorException) {
      response.status(400).json({
        statusCode: 400,
        message: exception.message,
      });
    } else {
      // 如果不是 ClientErrorException，抛出原始错误
      // super.catch(exception, host);
    }
  }
}
