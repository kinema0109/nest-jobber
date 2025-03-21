import { Module } from '@nestjs/common';
import { FibonacciJob } from './fibonacci.job';
import { DiscoveryModule } from '@golevelup/nestjs-discovery';
import { JobsService } from './jobs.service';
import { JobsResolvers } from './jobs.resolver';

@Module({
  imports: [DiscoveryModule],
  providers: [FibonacciJob, JobsService, JobsResolvers],
})
export class JobsModule {}
