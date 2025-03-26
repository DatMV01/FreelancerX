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

export class AuthRegisterLoginDto {
  @Transform(lowerCaseTransformer)
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  provider?: string = AuthProvidersEnum.EMAIL;

  @IsNotEmpty()
  fullName: string;

  @IsOptional()
  @Type(() => RoleDto)
  @Transform(userRoleTransformer)
  role: RoleDto = {
    id: RoleEnum.BUYER,
    name: RoleEnum[RoleEnum.BUYER],
  } as any;

  @IsOptional()
  @Type(() => StatusDto)
  @Transform(userStatusTransformer)
  status: StatusDto = {
    id: StatusEnum.UNACTIVATED,
    name: StatusEnum[StatusEnum.UNACTIVATED],
  } as any;
}
