import { IsString, IsNotEmpty, IsEnum, IsOptional, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
}

export class UpdateAccountDto extends CreateAccountDto {}

export class CreateJournalItemDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  accountId: string;

  @ApiProperty()
  @IsNumber()
  debit: number;

  @ApiProperty()
  @IsNumber()
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
