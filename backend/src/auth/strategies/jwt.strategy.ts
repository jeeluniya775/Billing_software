import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'fallback-secret',
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: any) {
    const userId = payload.sub;
    const tokenTenantId = payload.tenantId;
    const userRole = payload.role;

    // Default to the tenantId in the token
    let activeTenantId = tokenTenantId;

    // Check for X-Tenant-Id header (for shop switching)
    const headerTenantId = req.headers['x-tenant-id'];

    if (headerTenantId && headerTenantId !== tokenTenantId) {
      // ONLY Owners can switch between their own tenants
      if (userRole === 'OWNER') {
        const ownsTenant = await this.prisma.tenant.findFirst({
          where: { id: headerTenantId, ownerId: userId }
        });
        
        if (ownsTenant) {
          activeTenantId = headerTenantId;
        }
      } else {
        // For non-owners, we could verify if they are a member of this tenant
        const isMember = await this.prisma.user.findFirst({
          where: { id: userId, tenantId: headerTenantId }
        });
        if (isMember) {
          activeTenantId = headerTenantId;
        }
      }
    }

    return { 
      id: userId, 
      email: payload.email, 
      tenantId: activeTenantId, 
      role: userRole 
    };
  }
}
