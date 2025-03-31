/* eslint-disable @nx/enforce-module-boundaries */
import { Controller, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';
import {
  AuthenticateRequest,
  AuthServiceController,
  AuthServiceControllerMethods,
  User,
} from 'libs/grpc/src/lib/types/proto/auth';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { TokenPayLoad } from './token-payload.interface';

@Controller()
@AuthServiceControllerMethods()
export class AuthController implements AuthServiceController {
  constructor(private readonly usersService: UsersService) {}
  @UseGuards(JwtAuthGuard)
  authenticate(
    request: AuthenticateRequest & { user: TokenPayLoad }
  ): Promise<User> | Observable<User> | User {
    return this.usersService.getUser({ id: request.user.userId }) as any;
  }
}
