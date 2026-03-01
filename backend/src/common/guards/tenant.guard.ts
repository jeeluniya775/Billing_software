import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const tenantIdFromHeader = request.headers['x-tenant-id'];

    if (!user || !user.tenantId) {
      throw new ForbiddenException('User tenant context missing');
    }

    // If a header is provided, it must match the user's tenantId
    if (tenantIdFromHeader && tenantIdFromHeader !== user.tenantId) {
      throw new ForbiddenException('Tenant mismatch');
    }

    return true;
  }
}
