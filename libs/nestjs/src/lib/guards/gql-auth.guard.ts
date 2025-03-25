/* eslint-disable @nx/enforce-module-boundaries */
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ClientGrpc } from '@nestjs/microservices';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { AUTH_PACKAGE_NAME, AuthServiceClient } from 'types/proto/auth';

@Injectable()
export class GqlAuthGuard implements CanActivate, OnModuleInit {
  private readonly logger = new Logger(GqlAuthGuard.name);
  private authService: AuthServiceClient;

  constructor(@Inject(AUTH_PACKAGE_NAME) private client: ClientGrpc) {}

  onModuleInit() {
    try {
      this.authService =
        this.client.getService<AuthServiceClient>('AuthService');
      this.logger.log('gRPC AuthService initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize gRPC AuthService:', error);
      throw error;
    }
  }

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = this.getRequest(context);

    const token =
      request.cookies?.Authentication ||
      request.headers?.authentication ||
      request.headers?.['authentication'] ||
      request.headers?.cookie
        ?.split(';')
        .find((cookie: string) => cookie.trim().startsWith('Authentication='))
        ?.split('=')[1];


    if (!token) {
      this.logger.error('No authentication token found in request');
      throw new UnauthorizedException('No authentication token provided');
    }

    return this.authService.authenticate({ token }).pipe(
      map(() => {
        this.logger.log('Authentication successful');
        return true;
      }),
      catchError((err) => {
        this.logger.error('Authentication failed:', err);
        return throwError(
          () => new UnauthorizedException('Invalid authentication token')
        );
      })
    );
  }

  private getRequest(context: ExecutionContext) {
    try {
      const ctx = GqlExecutionContext.create(context);
      const req = ctx.getContext().req;
      return req;
    } catch (error) {
      this.logger.error('Failed to get request from context:', error);
      throw error;
    }
  }
}
