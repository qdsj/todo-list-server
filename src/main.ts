import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClientErrorFilter } from './filter/clientErrorFilter';
import { AllExceptionsFilter } from './filter/allExceptionsFilter';
import { TransformInterceptor } from './interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new AllExceptionsFilter(), new ClientErrorFilter());

  app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
