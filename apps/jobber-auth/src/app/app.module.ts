import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      context: (req, res) => ({ req, res }),
      autoSchemaFile: true,
      driver: ApolloDriver,
    }),
    UsersModule,
    AuthModule,
  ],
  providers: [],
})
export class AppModule {}
