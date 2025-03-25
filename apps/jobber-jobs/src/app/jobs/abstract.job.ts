import { Producer } from 'pulsar-client';
import { PulsarClient, serialize } from '@jobber/pulsar';
export abstract class AbstractJob<T> {
  private producer: Producer;

  constructor(private readonly pulsarClient: PulsarClient) {}
  async excute(data: object, job: string) {
    if (!this.producer) {
      this.producer = await this.pulsarClient.createProducer(job);
    }
    await this.producer.send({ data: serialize(data) });
  }
}
