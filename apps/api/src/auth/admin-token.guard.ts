import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminTokenGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(ctx: ExecutionContext): boolean {
    const expected = this.config.get<string>('ADMIN_TOKEN');
    if (!expected) throw new UnauthorizedException();
    const req = ctx.switchToHttp().getRequest<{ headers: { authorization?: string } }>();
    if (req.headers.authorization !== `Bearer ${expected}`) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
