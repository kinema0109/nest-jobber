import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './models/user.model';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly UsersService: UsersService) {}
  @Query(() => User)
  async createUser() {
    // return this.UsersService.user
  }
  @Mutation(() => [User], { name: 'users' })
  async getUsers() {
    // return this.UsersService.users();
  }
}
