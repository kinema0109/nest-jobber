import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginInput } from './dto/login.input';
import { Response } from 'express';
import { UsersService } from '../users/users.service';
import { compare } from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { TokenPayLoad } from './token-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {}
  async login({ email, password }: LoginInput, response: Response) {
    const user = await this.verifyUser(email, password);
    const expire = new Date();
    expire.setMilliseconds(
      expire.getTime() +
        parseInt(this.configService.getOrThrow('JWT_EXPIRES_IN'))
    );
    const TokenPayLoad: TokenPayLoad = { userId: user.id };
    const accessToken = this.jwtService.sign(TokenPayLoad);
    response.cookie('Authentication', accessToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      expires: expire,
    });
    // return { id: 1, email };
  }
  private async verifyUser(email: string, password: string) {
    try {
      const user = await this.userService.getUser({ email });
      if (!user) {
        throw new Error('User not found');
      }
      const authenticated = await compare(password, user.password);
      if (!authenticated) {
        throw new UnauthorizedException('Invalid password');
      }
      return user;
    } catch (error) {
      throw new UnauthorizedException(error, 'Invalid credentials');
    }
  }
}
