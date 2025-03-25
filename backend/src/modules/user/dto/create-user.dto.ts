import { HttpStatus, UnprocessableEntityException } from '@nestjs/common';
import { Transform, TransformationType, Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { RoleDto } from 'src/modules/roles/dto/role.dto';
import { RoleEnum } from 'src/modules/roles/roles.enum';
import { StatusDto } from 'src/modules/status/dto/status.dto';
import { StatusEnum } from 'src/modules/status/enum/statuses.enum';
import { AuthProvidersEnum } from '../enum/user.provider';

export class CreateUserDto {
  @IsString()
  @IsEmail()
  email: string;

  @MinLength(6)
  password?: string;

  @IsOptional()
  provider?: string = AuthProvidersEnum.EMAIL;

  @IsNotEmpty()
  fullName: string;

  @IsOptional()
  @Type(() => RoleDto)
  @Transform(({ value, key, obj, type, options }) => {
    if (type === TransformationType.PLAIN_TO_CLASS) {
      // This means the transformation is happening when receiving a request

      const role = String(value).toUpperCase();
      if (!Object.values(RoleEnum).includes(role)) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: { role: 'roleNotExists' },
        });
      }

      return {
        id: RoleEnum[role],
        name: RoleEnum[RoleEnum[role]],
      };
    } else if (type === TransformationType.CLASS_TO_PLAIN) {
      // This means the transformation is happening when sending a response
    }
  })
  role: RoleDto = {
    id: RoleEnum.BUYER,
    name: RoleEnum[RoleEnum.BUYER],
  } as any;

  @IsOptional()
  @Type(() => StatusDto)
  @Transform(({ value, key, obj, type, options }) => {
    if (type === TransformationType.PLAIN_TO_CLASS) {
      // This means the transformation is happening when receiving a request

      const status = String(value).toUpperCase();
      if (!Object.values(StatusEnum).includes(status)) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: { role: 'statusNotExists' },
        });
      }

      return {
        id: StatusEnum[status],
        name: StatusEnum[StatusEnum[status]],
      };
    } else if (type === TransformationType.CLASS_TO_PLAIN) {
      // This means the transformation is happening when sending a response
    }
  })
  status: StatusDto = {
    id: StatusEnum.UNDEACTIVATED,
    name: StatusEnum[StatusEnum.UNDEACTIVATED],
  } as any;

  @IsOptional()
  country?: string | undefined;

  @IsOptional()
  avatar?: string | undefined;

  @IsOptional()
  phoneNumber?: string | undefined;
}
