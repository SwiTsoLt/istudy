import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';

async function bootstrap() {
  const PORT = process.env.PORT ?? config.get('PORT');

  const app = await NestFactory.create(AppModule);
  await app.listen(PORT);
}
bootstrap();
