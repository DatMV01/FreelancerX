import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { GET_GROUP, UPDATE_GROUP } from 'src/common/constant/serialize.group';
import { formatDate } from 'src/utils/transformers/index.transformer';

export class BaseDto<T> {
  constructor(partial: Partial<T>) {
    Object.assign(this, partial);
  }

  @AutoMap()
  @ApiProperty()
  id: string | number;

  @AutoMap(() => Date)
  @Transform(({ value }) => formatDate(value))
  @ApiProperty()
  createdAt: Date;

  @AutoMap(() => Date)
  @Transform(({ value }) => formatDate(value))
  @ApiProperty()
  @Expose({ groups: [UPDATE_GROUP, GET_GROUP] })
  updatedAt: Date;

  @AutoMap(() => Date)
  @Transform(({ value }) => formatDate(value))
  @ApiProperty()
  deletedAt: Date;
}
