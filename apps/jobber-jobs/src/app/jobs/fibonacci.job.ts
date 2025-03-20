import { job } from "../decorators/job.decorator";
import { AbstractJob } from './abstract.job';

@job({
  name: 'fibonacci-job',
  description: 'This job calculates the fibonacci sequence of a given number.',
})
export class FibonacciJob extends AbstractJob {}