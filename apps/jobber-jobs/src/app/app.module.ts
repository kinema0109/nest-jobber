import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { JobsModule } from './jobs/job.smodule';

@Module({
  imports: [ConfigModule, JobsModule],
})
export class AppModule {}
