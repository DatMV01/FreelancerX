import { HttpStatus, UnprocessableEntityException } from '@nestjs/common';
import { TransformationType } from 'class-transformer';
import { TransformFnParams } from 'class-transformer/types/interfaces';
import { RoleDto } from 'src/modules/role/dto/role.dto';
import { RoleEnum } from 'src/modules/role/enum/role.enum';
import { StatusDto } from 'src/modules/status/dto/status.dto';
import { StatusEnum } from 'src/modules/status/enum/statuses.enum';
import { MaybeUndefined } from '../types/maybe.type';

const isValuesEmpty = (obj: object) =>
  Object.values(obj).every((v) => v == null || v == undefined);

export const lowerCaseTransformer = ({
  value,
  key,
  obj,
  type,
  options,
}: TransformFnParams): MaybeUndefined<string> => value?.toLowerCase().trim();

export function formatDate(date: Date) {
  return date?.toUTCString();
}

export const undefinedTransformer = ({
  value,
  key,
  obj,
  type,
  options,
}: TransformFnParams): MaybeUndefined<string> => {
  if (type === TransformationType.PLAIN_TO_CLASS) {
  } else if (type === TransformationType.CLASS_TO_PLAIN) {
    if (value && !isValuesEmpty(value)) return value;
    return undefined;
  }
};

export const userStatusTransformer = ({
  value,
  key,
  obj,
  type,
  options,
}: TransformFnParams): MaybeUndefined<StatusDto> => {
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
    } as any;
  } else if (type === TransformationType.CLASS_TO_PLAIN) {
    // This means the transformation is happening when sending a response
  }
};

export const userRoleTransformer = ({
  value,
  key,
  obj,
  type,
  options,
}: TransformFnParams): MaybeUndefined<RoleDto> => {
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
    } as any;
  } else if (type === TransformationType.CLASS_TO_PLAIN) {
    // This means the transformation is happening when sending a response
  }
};
