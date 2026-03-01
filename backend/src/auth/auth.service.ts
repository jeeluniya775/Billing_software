import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // 1. Check if user already exists (globally or per tenant, here unique per email across DB for simplicity in registration)
    const existingUser = await this.prisma.user.findFirst({
      where: { email: dto.email },
    });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // 3. Create Tenant and Admin User in a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({
        data: { name: dto.companyName },
      });

      const user = await tx.user.create({
        data: {
          name: dto.adminName,
          email: dto.email,
          password: hashedPassword,
          role: 'ADMIN',
          tenantId: tenant.id,
        },
      });

      return { user, tenant };
    });

    // 4. Generate JWT
    const token = this.generateToken(result.user);

    return {
      accessToken: token,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
      },
      tenant: result.tenant,
    };
  }

  async login(dto: LoginDto) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { email: dto.email },
        include: { tenant: true },
      });

      if (!user || !(await bcrypt.compare(dto.password, user.password))) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const token = this.generateToken(user);

      return {
        accessToken: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        tenant: user.tenant,
      };
    } catch (error) {
      console.error('[AuthService] Login error:', error);
      throw error;
    }
  }

  private generateToken(user: any) {
    const payload = { 
      sub: user.id, 
      email: user.email, 
      tenantId: user.tenantId, 
      role: user.role 
    };
    return this.jwtService.sign(payload);
  }
}
