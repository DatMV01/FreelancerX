import { HttpStatus, UnprocessableEntityException } from '@nestjs/common';

export const throwUnprocessableEntityException = (errors: any = {}) => {
  throw new UnprocessableEntityException({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    errors: errors,
  });
};
