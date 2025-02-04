import { Transform } from 'class-transformer';
import { formatDate } from 'src/utils/transformers/format-date.transformer';

export class BaseDto<T> {
  constructor(partial: Partial<T>) {
    Object.assign(this, partial);
  }

  id: string;

  @Transform(({ value }) => formatDate(value))
  createdAt: Date;

  @Transform(({ value }) => formatDate(value))
  updatedAt: Date;

  @Transform(({ value }) => formatDate(value))
  deletedAt: Date;
}
