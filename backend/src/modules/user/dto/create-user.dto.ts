import { AutoMap } from '@automapper/classes';
import { Transform, Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';
import { RoleDto } from 'src/modules/role/dto/role.dto';
import { StatusDto } from 'src/modules/status/dto/status.dto';
import {
  userRoleTransformer,
  userRoleTransformer2,
  userStatusTransformer,
  userStatusTransformer2,
} from 'src/utils/transformers/index.transformer';
import { AuthProvidersEnum } from '../enum/user.provider';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @AutoMap()
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @AutoMap()
  @ApiProperty({
    example: 'strongpassword',
    description: 'User password',
    minLength: 6,
  })
  @IsString()
  @Length(6)
  @IsNotEmpty()
  password: string;

  @AutoMap()
  @ApiProperty({
    example: 'EMAIL',
    enum: AuthProvidersEnum,
    description: 'Authentication provider',
  })
  @IsEnum(AuthProvidersEnum)
  @IsOptional()
  provider?: AuthProvidersEnum = AuthProvidersEnum.EMAIL;

  @AutoMap()
  @ApiProperty({ example: 'Nguyen Van A', description: 'User full name' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @AutoMap()
  @ApiProperty({
    example: 'Vietnam',
    description: 'User country',
    required: false,
  })
  @IsString()
  @IsOptional()
  country?: string | null;

  @AutoMap()
  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: 'User avatar URL',
    required: false,
  })
  @IsString()
  @IsOptional()
  avatar?: string | null;

  @AutoMap()
  @ApiProperty({
    example: '+84901234567',
    description: 'User phone number',
    required: false,
  })
  @IsString()
  @IsOptional()
  phoneNumber?: string | null;

  @AutoMap()
  @ApiProperty({ example: 1, description: 'User role ID', required: false })
  @IsOptional()
  @Transform(userRoleTransformer)
  roleId?: number | null;

  @AutoMap()
  @ApiProperty({ example: 1, description: 'User status ID', required: false })
  @IsOptional()
  @Transform(userStatusTransformer)
  statusId?: number | null;

  @IsOptional()
  @Type(() => StatusDto)
  @Transform(userStatusTransformer2)
  status?: StatusDto;

  @IsOptional()
  @Type(() => RoleDto)
  @Transform(userRoleTransformer2)
  role?: RoleDto;
}
