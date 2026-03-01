import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(configService: ConfigService) {
    const databaseUrl = configService.get<string>('DATABASE_URL');
    
    const pool = new Pool({ 
      connectionString: databaseUrl,
      ssl: {
        rejectUnauthorized: false,
      },
    });
    
    const adapter = new PrismaPg(pool);
    super({ adapter });
    
    console.log('[PrismaService] Initialized with adapter for:', databaseUrl?.split('@')[1] || 'Unknown');
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('[PrismaService] Connected to database');
    } catch (error) {
      console.error('[PrismaService] Connection error:', error);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
