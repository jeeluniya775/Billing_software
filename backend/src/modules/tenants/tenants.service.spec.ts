import { ForbiddenException } from '@nestjs/common';
import { TenantsService } from './tenants.service';

describe('TenantsService', () => {
  let service: TenantsService;
  const prisma = {
    tenant: {
      findFirst: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new TenantsService(prisma as any);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('ensureOwnerHasTenant throws when tenant not owned', async () => {
    prisma.tenant.findFirst.mockResolvedValue(null);

    await expect(service.ensureOwnerHasTenant('owner-1', 'shop-1')).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });

  it('ensureOwnerHasTenant passes when tenant is owned', async () => {
    prisma.tenant.findFirst.mockResolvedValue({ id: 'shop-1' });

    await expect(service.ensureOwnerHasTenant('owner-1', 'shop-1')).resolves.toBeUndefined();
  });
});
