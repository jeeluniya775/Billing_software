import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

async function seed() {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error('DATABASE_URL is not defined');
  
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
  const prisma = new PrismaClient({ adapter });
  
  try {
    console.log('Seed started...');

    // 1. Create a demo tenant
    const tenant = await prisma.tenant.create({
      data: { name: 'BillFast Demo Corp' },
    });

    // 2. Create a demo admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.create({
      data: {
        name: 'Demo Admin',
        email: 'admin@demo.com',
        password: hashedPassword,
        role: 'ADMIN',
        tenantId: tenant.id,
      },
    });

    // 3. Create Chart of Accounts
    const cashAccount = await prisma.account.create({
      data: { name: 'Cash at Bank', code: '1001', type: 'ASSET', balance: 25000, tenantId: tenant.id },
    });
    const salesAccount = await prisma.account.create({
      data: { name: 'Sales Revenue', code: '4000', type: 'REVENUE', tenantId: tenant.id },
    });
    const salaryExpense = await prisma.account.create({
      data: { name: 'Salary Expense', code: '5001', type: 'EXPENSE', tenantId: tenant.id },
    });

    // 4. Create Customers & Invoices
    const customer = await prisma.customer.create({
      data: { name: 'Acme Corp', email: 'billing@acme.com', tenantId: tenant.id },
    });
    await prisma.invoice.create({
      data: {
        invoiceNo: 'INV-001', customerId: customer.id, date: new Date(),
        dueDate: new Date(Date.now() + 30*24*60*60*1000), status: 'PAID',
        currency: 'USD', subtotal: 1000, total: 1000, tenantId: tenant.id,
        items: { create: [{ description: 'Consulting', quantity: 1, rate: 1000, total: 1000 }] }
      }
    });

    // 5. Create Employees
    const emp1 = await prisma.employee.create({
      data: {
        firstName: 'John', lastName: 'Doe', email: 'john@demo.com',
        jobTitle: 'Developer', department: 'Engineering', tenantId: tenant.id
      }
    });

    // 6. Create Marketing Data
    await prisma.campaign.create({
      data: {
        name: 'Spring Sale 2024', type: 'EMAIL', status: 'ACTIVE',
        budget: 5000, spend: 1200, tenantId: tenant.id
      }
    });
    await prisma.lead.create({
      data: {
        firstName: 'Alice', lastName: 'Johnson', email: 'alice@external.com',
        source: 'WEB', status: 'NEW', tenantId: tenant.id
      }
    });

    // 7. Create Assets
    await prisma.asset.create({
      data: {
        name: 'MacBook Pro M3', category: 'IT Equipment', status: 'Active',
        purchaseDate: new Date('2024-01-10'), purchaseCost: 2500, currentValue: 2300,
        serialNumber: 'SN-MPM3-9921', location: 'Corporate Office L4',
        department: 'Operations', assignedTo: 'Jeel Uniya',
        tenantId: tenant.id
      }
    });

    // 8. Create Payroll
    await prisma.payrollRecord.create({
      data: {
        employeeId: emp1.id, period: '2024-02', amount: 5000,
        status: 'PAID', paymentDate: new Date(), tenantId: tenant.id
      }
    });

    // 9. Create Time Entries
    await prisma.timeEntry.create({
      data: {
        employeeId: emp1.id, date: new Date(), hours: 8,
        description: 'Working on Dashboard implementation', project: 'BillFast',
        tenantId: tenant.id
      }
    });

    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Seed failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
