import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { init } from '@jobber/nestjs';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await init(app);
}

bootstrap();
