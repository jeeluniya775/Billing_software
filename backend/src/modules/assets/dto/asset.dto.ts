import { IsString, IsNumber, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAssetDto {
  @ApiProperty({ example: 'Dell Latitude 5420' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'HARDWARE' })
  @IsString()
  category: string;

  @ApiPropertyOptional({ example: 'ACTIVE' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ example: '2023-01-15T00:00:00.000Z' })
  @IsDateString()
  purchaseDate: string;

  @ApiProperty({ example: 1200.50 })
  @IsNumber()
  purchaseCost: number;

  @ApiProperty({ example: 1000.00 })
  @IsNumber()
  currentValue: number;

  @ApiPropertyOptional({ example: 'Office Wing A' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ example: 'SN-12345' })
  @IsOptional()
  @IsString()
  serialNumber?: string;

  @ApiPropertyOptional({ example: 'Engineering' })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiPropertyOptional({ example: 'John Doe' })
  @IsOptional()
  @IsString()
  assignedTo?: string;

  @ApiPropertyOptional({ example: 'Straight Line' })
  @IsOptional()
  @IsString()
  depreciationMethod?: string;

  @ApiPropertyOptional({ example: 'Low' })
  @IsOptional()
  @IsString()
  riskFactor?: string;

  @ApiPropertyOptional({ example: 85 })
  @IsOptional()
  @IsNumber()
  utilization?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  lastMaintenanceDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  maintenanceCost?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  maintenanceNotes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  nextServiceDate?: string;
}

export class UpdateAssetDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  purchaseDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  purchaseCost?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  currentValue?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  serialNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  department?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  assignedTo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  depreciationMethod?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  riskFactor?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  utilization?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  lastMaintenanceDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  maintenanceCost?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  maintenanceNotes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  nextServiceDate?: string;
}
