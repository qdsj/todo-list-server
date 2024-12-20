import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import ClientErrorException from 'src/exception/ClientErrorException';

@Catch(ClientErrorException)
export class ClientErrorFilter implements ExceptionFilter {
  catch(exception: ClientErrorException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response.status(400).json({
      statusCode: 400,
      message: exception.message,
    });
  }
}
