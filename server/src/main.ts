import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { initAdapters } from './app/adapters.init';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  initAdapters(app);
  app.use(cookieParser());
  await app.listen(4000);
}
bootstrap();
