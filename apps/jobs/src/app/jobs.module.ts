/* eslint-disable @nx/enforce-module-boundaries */
import { Module } from '@nestjs/common';
import { FibonacciJob } from './jobs/fibonacci/fibonacci.job';
import { DiscoveryModule } from '@golevelup/nestjs-discovery';
import { JobsService } from './jobs.service';
import { JobsResolvers } from './jobs.resolver';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_PACKAGE_NAME } from 'libs/grpc/src/lib/types/proto/auth';
import { join } from 'path';
import { PulsarModule } from '@jobber/pulsar';

@Module({
  imports: [
    DiscoveryModule,
    PulsarModule,
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
