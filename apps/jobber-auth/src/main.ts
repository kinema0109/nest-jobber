/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { GrpcOptions, Transport } from '@nestjs/microservices';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { AUTH_PACKAGE_NAME } from 'types/proto/auth'; // Ensure this path is correct and the file exists
import { join } from 'path';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  // Enable CORS
  app.enableCors({
    origin: true, // Allow all origins in development
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.setGlobalPrefix(globalPrefix);
  app.use(cookieParser());
  const port = app.get(ConfigService).getOrThrow('PORT');
  app.connectMicroservice<GrpcOptions>({
    transport: Transport.GRPC,
    options: {
      package: AUTH_PACKAGE_NAME,
      protoPath: join(process.cwd(), 'dist/apps/jobber-auth/proto/auth.proto'),
    },
  });
  await app.startAllMicroservices();
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
