import { IsString, IsNotEmpty, IsEnum, IsOptional, IsNumber, IsArray, ValidateNested, Min, IsBoolean, IsInt, Max, MinLength } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';
import { AccountType, JournalStatus } from '@prisma/client';

export class CreateAccountDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ enum: AccountType })
  @IsEnum(AccountType)
  type: AccountType;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateAccountDto extends PartialType(CreateAccountDto) {}

export class CreateJournalItemDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  accountId: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  debit: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  credit: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;
}

export class CreateJournalEntryDto {
  @ApiPropertyOptional()
  @IsOptional()
  date?: Date;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  reference?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ enum: JournalStatus })
  @IsEnum(JournalStatus)
  @IsOptional()
  status?: JournalStatus;

  @ApiProperty({ type: [CreateJournalItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateJournalItemDto)
  items: CreateJournalItemDto[];
}

export class UpdateAccountingSettingsDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MinLength(4)
  fiscalYear?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MinLength(3)
  baseCurrency?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  periodLocked?: boolean;
}

export class CreateRecurringJournalEntryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  frequency?: string;

  @ApiPropertyOptional()
  @IsInt()
  @Min(1)
  @Max(28)
  @IsOptional()
  dayOfMonth?: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'JSON template payload for journal creation' })
  @IsOptional()
  template?: Record<string, unknown>;
}

export class UpdateRecurringJournalEntryDto extends PartialType(CreateRecurringJournalEntryDto) {}
