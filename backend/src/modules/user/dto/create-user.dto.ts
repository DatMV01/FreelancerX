import { AutoMap } from '@automapper/classes';
import { Transform, Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
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

export class CreateUserDto {
  @AutoMap()
  @IsEmail()
  email: string;

  @AutoMap()
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @AutoMap()
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @AutoMap()
  @IsOptional()
  @IsString()
  country?: string;

  @AutoMap()
  @IsOptional()
  @IsString()
  avatar?: string;

  @AutoMap()
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @AutoMap()
  @IsEnum(AuthProvidersEnum)
  @IsOptional()
  provider?: string = AuthProvidersEnum.EMAIL;

  @AutoMap()
  @IsOptional()
  @Transform(userRoleTransformer)
  roleId?: number;

  @AutoMap()
  @IsOptional()
  @Transform(userStatusTransformer)
  statusId?: number;

  @IsOptional()
  @Type(() => StatusDto)
  @Transform(userStatusTransformer2)
  status?: StatusDto;

  @IsOptional()
  @Type(() => RoleDto)
  @Transform(userRoleTransformer2)
  role?: RoleDto;
}
