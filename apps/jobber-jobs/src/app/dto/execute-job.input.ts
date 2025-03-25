import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import JSON from 'graphql-type-json';
import { FibonacciData } from '../jobs/fibonacci/fibonacci.data.interface';
@InputType()
export class ExecuteJobInput {
  @Field()
  @IsNotEmpty()
  name: string;
  @Field(() => JSON)
  @IsNotEmpty()
  data: FibonacciData | FibonacciData[];
}
