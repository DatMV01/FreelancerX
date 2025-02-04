import { AutoMap } from '@automapper/classes';
import { Transform } from 'class-transformer';
import { formatDate } from 'src/utils/transformers/format-date.transformer';

export class BaseDto<T> {
  constructor(partial: Partial<T>) {
    Object.assign(this, partial);
  }

  @AutoMap()
  id: string;

  @AutoMap()
  @Transform(({ value }) => formatDate(value))
  createdAt: Date;

  @AutoMap()
  @Transform(({ value }) => formatDate(value))
  updatedAt: Date;

  @AutoMap()
  @Transform(({ value }) => formatDate(value))
  deletedAt: Date;
}
