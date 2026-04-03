import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TimeService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.timeEntry.findMany({
      where: { tenantId },
      include: { employee: true },
      orderBy: { date: 'desc' },
    });
  }

  async getSummary(tenantId: string) {
    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const entries = await this.prisma.timeEntry.findMany({ where: { tenantId } });

    const totalHoursToday = entries
      .filter(e => e.date >= todayStart)
      .reduce((acc, e) => acc + e.hours, 0);

    return {
      totalHoursToday,
      totalHoursThisMonth: entries.reduce((acc, e) => acc + e.hours, 0), // Simplified
      activeProjects: Array.from(new Set(entries.map(e => e.project).filter(Boolean))).length,
      averageProductivity: 85, // Mocked for now
    };
  }

  async create(tenantId: string, data: any) {
    return this.prisma.timeEntry.create({
      data: { ...data, tenantId },
    });
  }
}
