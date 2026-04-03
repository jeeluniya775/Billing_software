import { IsString, IsNotEmpty, IsEmail, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EmployeeStatus, AttendanceStatus } from '@prisma/client';

export class CreateEmployeeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  jobTitle: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  department: string;

  @ApiPropertyOptional({ enum: EmployeeStatus })
  @IsEnum(EmployeeStatus)
  @IsOptional()
  status?: EmployeeStatus;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  hireDate?: string;
}

export class UpdateEmployeeDto extends CreateEmployeeDto {}

export class RecordAttendanceDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  date?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  checkIn?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  checkOut?: string;

  @ApiPropertyOptional({ enum: AttendanceStatus })
  @IsEnum(AttendanceStatus)
  @IsOptional()
  status?: AttendanceStatus;
}
