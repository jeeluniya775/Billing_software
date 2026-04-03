import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(configService: ConfigService) {
    const databaseUrl = configService.get<string>('DATABASE_URL');
    if (!databaseUrl) {
      throw new Error('DATABASE_URL is not defined');
    }

    const host = databaseUrl.split('@')[1].split(':')[0];

    const isLocalhost = host === 'localhost' || host === '127.0.0.1';

    const pool = new Pool({ 
      connectionString: databaseUrl,
      ssl: isLocalhost ? false : {
        rejectUnauthorized: false,
        servername: host,
      },
    });
    
    const adapter = new PrismaPg(pool);
    super({ adapter });
    
    console.log('[PrismaService] Initialized with adapter for:', host);
  }

  async onModuleInit() {
    try {
      console.log('[PrismaService] Connecting to database...');
      await this.$connect();
      console.log('[PrismaService] Successfully connected to database');
    } catch (error) {
      console.error('[PrismaService] Connection failed:', error);
      if (error.code === 'P1001') {
        console.error('[PrismaService] Tip: Check if the database host is reachable and SSL settings are correct.');
      }
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
