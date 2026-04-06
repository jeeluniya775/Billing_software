import { IsEmail, IsNotEmpty, IsString, IsEnum, IsUUID } from 'class-validator';

export enum UserRole {
  SHOP_MANAGER = 'SHOP_MANAGER',
  ACCOUNTANT = 'ACCOUNTANT',
  STAFF = 'STAFF',
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

}
