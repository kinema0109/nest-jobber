import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { GqlContext } from '@jobber/nestjs';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      context: ({ req, res }): GqlContext => {
        return {
          req,
          res,
        };
      },
      autoSchemaFile: true,
      driver: ApolloDriver,
      csrfPrevention: false,
      playground: {
        settings: {
          'request.credentials': 'include',
        },
      },
    }),
    UsersModule,
    AuthModule,
  ],
  providers: [],
})
export class AppModule {}
