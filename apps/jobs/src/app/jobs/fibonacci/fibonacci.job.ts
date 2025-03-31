import { PulsarClient } from '@jobber/pulsar';
import { job } from '../../decorators/job.decorator';
import { AbstractJob } from '../abstract.job';
import { FibonacciData } from './fibonacci.data.interface';

@job({
  name: 'fibonacci-job',
  description: 'This job calculates the fibonacci sequence of a given number.',
})
export class FibonacciJob extends AbstractJob<FibonacciData> {
  protected messageClass: new () => FibonacciData;
  constructor(pulsarClient: PulsarClient) {
    super(pulsarClient);
  }
}
