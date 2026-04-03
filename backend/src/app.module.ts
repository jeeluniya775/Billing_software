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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    ProductsModule,
    SalesModule,
    AccountingModule,
    HRModule,
    ExpenseModule,
    MarketingModule,
    PayrollModule,
    AssetsModule,
    TimeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
