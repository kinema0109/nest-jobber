import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { TokenPayLoad } from '../token-payload.interface';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService, private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => request.cookies?.Authentication || request.token
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('JWT_SECRET'),
    });
  }

  async validate(payload: TokenPayLoad) {
    return payload;
  }
}
