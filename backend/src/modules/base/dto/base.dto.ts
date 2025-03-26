import { AutoMap } from '@automapper/classes';
import { Transform } from 'class-transformer';
import { formatDate } from 'src/utils/transformers/index.transformer';

export class BaseDto<T> {
  constructor(partial: Partial<T>) {
    Object.assign(this, partial);
  }

  @AutoMap()
  id: string | number;

  @AutoMap(() => Date)
  @Transform(({ value }) => formatDate(value))
  createdAt: Date;

  @AutoMap(() => Date)
  @Transform(({ value }) => formatDate(value))
  //  @Expose({ groups: [UPDATE_GROUP, GET_GROUP] })
  updatedAt: Date;

  @AutoMap(() => Date)
  @Transform(({ value }) => formatDate(value))
  deletedAt: Date;
}
