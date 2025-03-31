import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './models/user.model';
import { UsersService } from './users.service';
import { CreateUserInput } from './dto/create-user.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
// import { CurrentUser } from '../auth/current-user.decorator';
// import { TokenPayLoad } from '../auth/token-payload.interface';
// import { Prisma } from '@prisma-clients/auth';
@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}
  @Mutation(() => User)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.createUser(createUserInput);
  }
  @UseGuards(GqlAuthGuard)
  @Query(() => [User], { name: 'users' })
  async getUsers() {
    return this.usersService.getUsers();
  }
  // async getUser(@Args('UserWhereUniqueInput') id: Prisma.UserWhereUniqueInput) {
  //   return this.usersService.getUser(id);
  // }
}
