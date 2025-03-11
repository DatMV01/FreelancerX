import { AutoMap } from '@automapper/classes';
import { Expose, Transform } from 'class-transformer';
import { UPDATE_GROUP, GET_GROUP } from 'src/common/constant/serialize.group';
import { formatDate } from 'src/utils/transformers/format-date.transformer';

export class BaseDto<T> {
  constructor(partial: Partial<T>) {
    Object.assign(this, partial);
  }

  @AutoMap()
  id: string;

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
