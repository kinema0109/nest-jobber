import {
  DiscoveredClassWithMeta,
  DiscoveryService,
} from '@golevelup/nestjs-discovery';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { JOB_METADATA_KEY } from '../decorators/job.decorator';
import { AbstractJob } from './abstract.job';
import { JobMetadata } from '../interfaces/job-metadata.interface';
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
  async executeJob(name: string) {
    const job = this.jobs.find((job) => job.meta.name === name);
    if (!job) {
      throw new Error(`Job ${name} not found`);
    }
    await (job.discoveredClass.instance as AbstractJob).excute();
    return job.meta;
  }
  async createJob() {
    return;
  }
}
