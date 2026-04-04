import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './modules/products/products.module';
import { SalesModule } from './modules/sales/sales.module';
import { AccountingModule } from './modules/accounting/accounting.module';
import { HRModule } from './modules/hr/hr.module';
import { ExpenseModule } from './modules/expense/expense.module';

import { MarketingModule } from './modules/marketing/marketing.module';
import { PayrollModule } from './modules/payroll/payroll.module';
import { AssetsModule } from './modules/assets/assets.module';
import { TimeModule } from './modules/time/time.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TenantsModule } from './modules/tenants/tenants.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    PrismaModule,
    AuthModule,
    ProductsModule,
    UploadsModule,
    SalesModule,
    AccountingModule,
    HRModule,
    ExpenseModule,
    MarketingModule,
    PayrollModule,
    AssetsModule,
    TimeModule,
    TenantsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
