import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

async function testNativePrisma() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error('DATABASE_URL is not defined in .env');
    return;
  }
  
  console.log('Testing native Prisma connection to:', url.split('@')[1]);
  
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: url
      }
    }
  } as any);

  try {
    await prisma.$connect();
    console.log('Successfully connected with native Prisma!');
    const result = await prisma.$queryRaw`SELECT NOW()`;
    console.log('Query result:', result);
  } catch (err) {
    console.error('Native Prisma connection error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

testNativePrisma();
