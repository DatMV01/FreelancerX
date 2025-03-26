import { Transform, Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { RoleDto } from 'src/modules/role/dto/role.dto';
import { RoleEnum } from 'src/modules/role/enum/role.enum';
import { StatusDto } from 'src/modules/status/dto/status.dto';
import { StatusEnum } from 'src/modules/status/enum/statuses.enum';
import {
  lowerCaseTransformer,
  userRoleTransformer,
  userStatusTransformer,
} from 'src/utils/transformers/index.transformer';
import { AuthProvidersEnum } from '../enum/auth-providers.enum';
import { AutoMap } from '@automapper/classes';

export class AuthRegisterLoginDto {
  @AutoMap()
  @Transform(lowerCaseTransformer)
  @IsString()
  @IsEmail()
  email: string;

  @AutoMap()
  @IsString()
  @MinLength(6)
  password: string;

  @AutoMap()
  @IsOptional()
  provider?: string = AuthProvidersEnum.EMAIL;

  @AutoMap()
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @AutoMap(() => RoleDto)
  @IsOptional()
  @Type(() => RoleDto)
  @Transform(userRoleTransformer)
  role: RoleDto;

  @AutoMap(() => StatusDto)
  @IsOptional()
  @Type(() => StatusDto)
  @Transform(userStatusTransformer)
  status: StatusDto;

  @AutoMap()
  @IsNotEmpty()
  @IsOptional()
  avatar: string;

  @AutoMap()
  @IsNotEmpty()
  @IsOptional()
  country: string;

  @AutoMap()
  @IsNotEmpty()
  @IsOptional()
  phoneNumber: string;
}
