/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PulsarClient, PulsarConsumer } from '@jobber/pulsar';
import { FibonacciData } from './fibonacci-data.interface';
import { iterate } from 'fibonacci';

@Injectable()
export class FibonacciConsumer
  extends PulsarConsumer<FibonacciData>
  implements OnModuleInit
{
  constructor(pulsarClient: PulsarClient) {
    super(pulsarClient, 'fibonacci-job');
  }

  protected async onMessage(data: FibonacciData): Promise<void> {
    console.log('fibonacci Consumer.onmessage');
    console.log('Received data:', data);
    const result = iterate(data.iterations);
    this.logger.log(`Fibonacci result: ${result}`);
  }
}
