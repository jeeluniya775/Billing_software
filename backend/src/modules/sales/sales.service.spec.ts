import { ForbiddenException } from '@nestjs/common';
import { SalesService } from './sales.service';

describe('SalesService', () => {
  const createPrismaMock = () => ({
    customer: {
      create: jest.fn(),
      findFirst: jest.fn(),
    },
    product: {
      findMany: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
    invoice: {
      create: jest.fn(),
    },
    tenant: {
      findMany: jest.fn(),
    },
  });

  it('createCustomer always uses authenticated tenant context', async () => {
    const prisma = createPrismaMock();
    prisma.customer.create.mockResolvedValue({ id: 'c1' });
    const service = new SalesService(prisma as any);

    await service.createCustomer('tenant-auth', {
      name: 'Customer',
      // @ts-expect-error runtime hardening check
      tenantId: 'tenant-other',
    });

    expect(prisma.customer.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ tenantId: 'tenant-auth' }),
      }),
    );
  });

  it('createPortalOrder rejects items from other shops', async () => {
    const prisma = createPrismaMock();
    const service = new SalesService(prisma as any);
    prisma.product.findMany.mockResolvedValue([
      { id: 'p1', name: 'InShop', price: 10, tenantId: 'shop-a' },
    ]);

    await expect(
      service.createPortalOrder('user-1', 'shop-a', [
        { productId: 'p1', quantity: 1 },
        { productId: 'p2', quantity: 1 },
      ]),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });
});
