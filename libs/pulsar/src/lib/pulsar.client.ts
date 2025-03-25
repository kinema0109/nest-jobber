import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, Consumer, Message, Producer } from 'pulsar-client';
@Injectable()
export class PulsarClient implements OnModuleDestroy {
  private readonly client = new Client({
    serviceUrl: this.configService.getOrThrow<string>('PULSAR_SERVICE_URL'),
  });

  private readonly producer: Producer[] = [];
  private readonly consumer: Consumer[] = [];

  constructor(private readonly configService: ConfigService) {}

  async createProducer(topic: string) {
    const producer = await this.client.createProducer({
      topic,
    });
    this.producer.push(producer);
    return producer;
  }

  async createConsumer(topic: string, listener: (message: Message) => void) {
    const consumer = await this.client.subscribe({
      topic,
      subscription: 'jobber',
      listener,
    });
    this.consumer.push(consumer);
    return consumer;
  }

  async onModuleDestroy() {
    for (const producer of this.producer) {
      producer.close();
    }
    await this.client.close();
  }
}
