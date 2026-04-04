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

    // If user is not an OWNER, they MUST match their assigned tenantId
    if (user.role !== 'OWNER') {
      if (tenantIdFromHeader && tenantIdFromHeader !== user.tenantId) {
        throw new ForbiddenException('Tenant mismatch: You are restricted to your assigned shop.');
      }
    }

    return true;
  }
}
