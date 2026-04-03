import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEmployeeDto, UpdateEmployeeDto, RecordAttendanceDto } from './dto/hr.dto';

@Injectable()
export class HRService {
  constructor(private prisma: PrismaService) {}

  async createEmployee(tenantId: string, dto: CreateEmployeeDto) {
    return this.prisma.employee.create({
      data: {
        ...dto,
        tenantId,
      },
    });
  }

  async findAllEmployees(tenantId: string) {
    return this.prisma.employee.findMany({
      where: { tenantId },
      orderBy: { hireDate: 'desc' },
    });
  }

  async findOneEmployee(tenantId: string, id: string) {
    const employee = await this.prisma.employee.findFirst({
      where: { id, tenantId },
      include: {
        attendance: true,
        leaves: true,
      },
    });
    if (!employee) throw new NotFoundException('Employee not found');
    return employee;
  }

  async updateEmployee(tenantId: string, id: string, dto: UpdateEmployeeDto) {
    await this.findOneEmployee(tenantId, id);
    return this.prisma.employee.update({
      where: { id },
      data: dto,
    });
  }

  async recordAttendance(tenantId: string, dto: RecordAttendanceDto) {
    const { employeeId, date, ...attendanceData } = dto;
    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);

    return this.prisma.attendance.upsert({
      where: {
        employeeId_date: {
          employeeId,
          date: targetDate,
        },
      },
      update: attendanceData,
      create: {
        employeeId,
        date: targetDate,
        ...attendanceData,
      },
    });
  }

  async getAttendanceReport(tenantId: string, startDate: string, endDate: string) {
    return this.prisma.attendance.findMany({
      where: {
        employee: { tenantId },
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      include: {
        employee: true,
      },
      orderBy: { date: 'desc' },
    });
  }
  async getHRAnalytics(tenantId: string) {
    const employees = await this.prisma.employee.findMany({
      where: { tenantId },
      include: {
        attendance: {
          where: {
            date: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
            },
          },
        },
      },
    });

    const totalEmployees = employees.length;
    const activeEmployees = employees.filter((e) => e.status === 'ACTIVE').length;
    const onLeaveToday = employees.filter((e) => e.status === 'ON_LEAVE').length;

    const departments = Array.from(new Set(employees.map((e) => e.department)));
    const roles = Array.from(new Set(employees.map((e) => e.jobTitle)));

    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const newJoinersMonth = employees.filter(
      (e) => e.hireDate >= firstDayOfMonth,
    ).length;

    const presentToday = employees.filter(
      (e) =>
        e.attendance.length > 0 && e.attendance[0].status === 'PRESENT',
    ).length;
    const attendanceRate =
      totalEmployees > 0 ? (presentToday / totalEmployees) * 100 : 0;

    return {
      totalEmployees,
      activeEmployees,
      departmentsCount: departments.length,
      newJoinersMonth,
      onLeaveToday,
      attendanceRate,
      hiringTrend: [
        { month: 'Jan', count: 2 },
        { month: 'Feb', count: 3 },
        { month: 'Mar', count: 5 },
      ],
      deptDistribution: departments.map((d) => ({
        name: d,
        value: employees.filter((e) => e.department === d).length,
      })),
      attendanceTrend: [
        { day: 'Mon', rate: 95 },
        { day: 'Tue', rate: 98 },
        { day: 'Wed', rate: 92 },
      ],
      roleDistribution: roles.map((r) => ({
        role: r,
        count: employees.filter((e) => e.jobTitle === r).length,
      })),
    };
  }
}
