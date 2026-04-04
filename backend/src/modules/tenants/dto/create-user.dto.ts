import { IsEmail, IsNotEmpty, IsString, IsEnum, IsUUID } from 'class-validator';

export enum UserRole {
  ADMIN = 'ADMIN',
  ACCOUNTANT = 'ACCOUNTANT',
  STAFF = 'STAFF',
  OWNER = 'OWNER',
}

export class CreateShopUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;

  @IsUUID()
  @IsNotEmpty()
  tenantId: string;
}
