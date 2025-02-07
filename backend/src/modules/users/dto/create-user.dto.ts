import { HttpStatus, UnprocessableEntityException } from '@nestjs/common';
import { Transform, TransformationType, Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { AuthProvidersEnum } from 'src/modules/auth/enum/auth-providers.enum';
import { RoleDto } from 'src/modules/roles/dto/role.dto';
import { RoleEnum } from 'src/modules/roles/roles.enum';
import { StatusDto } from 'src/modules/status/dto/status.dto';
import { StatusEnum } from 'src/modules/status/enum/statuses.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string | null;

  @MinLength(6)
  password?: string;

  provider?: string = AuthProvidersEnum.email;

  socialId?: string | null;

  @IsNotEmpty()
  firstName: string | null;

  @IsNotEmpty()
  lastName: string | null;

  @IsOptional()
  photo?: string | null;

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
      };
    } else if (type === TransformationType.CLASS_TO_PLAIN) {
      // This means the transformation is happening when sending a response
    }
  })
  role?: RoleDto | null;

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

      return { id: StatusEnum[status] };
    } else if (type === TransformationType.CLASS_TO_PLAIN) {
      // This means the transformation is happening when sending a response
    }
  })
  status?: StatusDto;
}
