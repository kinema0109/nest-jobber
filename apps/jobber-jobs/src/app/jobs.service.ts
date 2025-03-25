import {
  DiscoveredClassWithMeta,
  DiscoveryService,
} from '@golevelup/nestjs-discovery';
import {
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { JOB_METADATA_KEY } from './decorators/job.decorator';
import { AbstractJob } from './jobs/abstract.job';
import { JobMetadata } from './interfaces/job-metadata.interface';
import { FibonacciData } from './jobs/fibonacci/fibonacci.data.interface';
// import { Args } from '@nestjs/graphql';

@Injectable()
export class JobsService implements OnModuleInit {
  private jobs: DiscoveredClassWithMeta<JobMetadata>[] = [];
  constructor(private readonly discoveryService: DiscoveryService) {}
  async onModuleInit() {
    this.jobs = await this.discoveryService.providersWithMetaAtKey<JobMetadata>(
      JOB_METADATA_KEY
    );
  }
  async getJobs() {
    return this.jobs.map((job) => job.meta);
  }
  async executeJob<T>(name: string, data: FibonacciData | FibonacciData[]) {
    const job = this.jobs.find((job) => job.meta.name === name);
    if (!job) {
      throw new Error(`Job ${name} not found`);
    }
    if (!(job.discoveredClass.instance instanceof AbstractJob)) {
      throw new InternalServerErrorException(
        'job is not an instance AbstractJob'
      );
    }
    await(
      job.discoveredClass.instance as AbstractJob<
        FibonacciData | FibonacciData[]
      >
    ).excute(data, job.meta.name);
    return job.meta;
  }
  async createJob() {
    return;
  }
}
