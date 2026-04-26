import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { AuthenticatedUser } from './jwt.strategy';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = AuthenticatedUser | null>(err: unknown, user: AuthenticatedUser | false): TUser {
    if (err) throw err;
    return (user || null) as TUser;
  }
}
