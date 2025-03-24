/* eslint-disable @nx/enforce-module-boundaries */
import { Module } from '@nestjs/common';
import { FibonacciJob } from './fibonacci.job';
import { DiscoveryModule } from '@golevelup/nestjs-discovery';
import { JobsService } from './jobs.service';
import { JobsResolvers } from './jobs.resolver';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_PACKAGE_NAME } from 'types/proto/auth';
import { join } from 'path';

@Module({
  imports: [
    DiscoveryModule,
    ClientsModule.register([
      {
        name: AUTH_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: 'auth',
          protoPath: join(__dirname, '../../../proto/auth.proto'),
          loader: {
            keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true,
            arrays: true,
            objects: true,
          },
          maxReceiveMessageLength: 1024 * 1024 * 10, // 10MB
          maxSendMessageLength: 1024 * 1024 * 10, // 10MB
        },
      },
    ]),
  ],
  providers: [FibonacciJob, JobsService, JobsResolvers],
})
export class JobsModule {}
