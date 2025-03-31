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
  userRoleTransformer2,
  userStatusTransformer,
  userStatusTransformer2,
} from 'src/utils/transformers/index.transformer';
import { AuthProvidersEnum } from '../enum/auth-providers.enum';
import { AutoMap } from '@automapper/classes';
import { ApiPropertyOptional } from '@nestjs/swagger';

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

  @AutoMap()
  @IsNotEmpty()
  @IsOptional()
  avatar: string;

  @AutoMap()
  @IsNotEmpty()
  @IsOptional()
  country?: string;

  @AutoMap()
  @IsNotEmpty()
  @IsOptional()
  phoneNumber?: string;
}
