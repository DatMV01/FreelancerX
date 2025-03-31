import { AutoMap } from '@automapper/classes';
import { Transform, Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StatusEnum } from 'src/modules/status/enum/statuses.enum';
import { RoleEnum } from 'src/modules/role/enum/role.enum';

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
    description: 'User password (minimum 6 characters)',
    minLength: 6,
  })
  @IsString()
  @Length(6)
  @IsNotEmpty()
  password: string;

  @AutoMap(() => String)
  @ApiPropertyOptional({
    example: 'EMAIL',
    enum: AuthProvidersEnum,
    enumName: 'AuthProvidersEnum',
    description: 'Authentication provider',
  })
  @IsEnum(AuthProvidersEnum)
  @IsOptional()
  provider: AuthProvidersEnum = AuthProvidersEnum.EMAIL;

  @AutoMap()
  @ApiProperty({
    example: 'Nguyen Van A',
    description: 'User full name',
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @AutoMap()
  @ApiPropertyOptional({
    example: 'Vietnam',
    description: 'User country',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  country?: string;

  @AutoMap()
  @ApiPropertyOptional({
    example: 'https://example.com/avatar.jpg',
    description: 'User avatar URL',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  avatar?: string;

  @AutoMap()
  @ApiPropertyOptional({
    example: '+84901234567',
    description: 'User phone number (international format)',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  // @AutoMap()
  // @ApiPropertyOptional({
  //   example: 1,
  //   description: 'User role ID (mapped to RoleDto)',
  // })
  // @IsOptional()
  // @Transform(userRoleTransformer)
  // roleId?: number = RoleEnum.ADMIN;

  // @AutoMap()
  // @ApiPropertyOptional({
  //   example: 1,
  //   description: 'User status ID (mapped to StatusDto)',
  // })
  // @IsOptional()
  // @Transform(userStatusTransformer)
  // statusId?: number = StatusEnum.UNACTIVATED;

  @AutoMap()
  @ApiPropertyOptional({
    type: StatusDto,
    description: 'User status',
  })
  @IsOptional()
  @Type(() => StatusDto)
  @Transform(userStatusTransformer2)
  status: StatusDto = {
    id: StatusEnum.UNACTIVATED,
    name: StatusEnum[StatusEnum.UNACTIVATED],
  } as any;

  @AutoMap()
  @ApiPropertyOptional({
    type: RoleDto,
    description: 'User role',
  })
  @IsOptional()
  @Type(() => RoleDto)
  @Transform(userRoleTransformer2)
  role: RoleDto = {
    id: RoleEnum.BUYER,
    name: RoleEnum[RoleEnum.BUYER],
  } as any;
}
