import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { timingSafeEqual } from 'node:crypto';
import type { Request } from 'express';

@Injectable()
export class AdminSecretGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authorization = request.header('authorization');
    const suppliedSecret = authorization?.startsWith('Bearer ')
      ? authorization.slice('Bearer '.length)
      : '';
    const configuredSecret = this.config.getOrThrow<string>('TRACKING_SECRET');
    const supplied = Buffer.from(suppliedSecret);
    const configured = Buffer.from(configuredSecret);

    if (
      supplied.length === 0 ||
      supplied.length !== configured.length ||
      !timingSafeEqual(supplied, configured)
    ) {
      throw new UnauthorizedException('Invalid operator credentials');
    }

    return true;
  }
}
