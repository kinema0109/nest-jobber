import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Job } from './models/job-model';
import { JobsService } from './jobs.service';
import { ExecuteJobInput } from './dto/execute-job.input';

@Resolver()
export class JobsResolvers {
  constructor(private readonly jobsService: JobsService) {}
  @Query(() => [Job], { name: 'jobs' })
  async getjob() {
    return this.jobsService.getJobs();
  }
  @Mutation(() => Job)
  async createJob() {
    return;
  }
  @Mutation(() => Job)
  async executeJob(@Args('executeJobInput') executeJobInput: ExecuteJobInput) {
    return this.jobsService.executeJob(executeJobInput.name);
  }
}
