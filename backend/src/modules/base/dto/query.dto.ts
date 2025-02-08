import { Transform, TransformationType, Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { FindOptionsOrder, FindOptionsWhere } from 'typeorm';

export class QueryDto<Entity> {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit: number = 10;

  get _limit(): number {
    return Math.min(this.limit || 10, 50);
  }

  @IsOptional()
  //@IsString()
  @Transform(({ value, key, obj, type, options }) => {
    if (type === TransformationType.PLAIN_TO_CLASS) {
      // This means the transformation is happening when receiving a request

      let sortFields;
      if (value instanceof Array) {
        sortFields = value;
      } else if (typeof value === 'string') {
        sortFields = value.split(',');
      }

      const sortObj: FindOptionsOrder<Entity> = {};
      sortFields.forEach((field) => {
        const [key, order] = field.split(':');
        (sortObj as any)[key] = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
      });

      return sortObj;
    } else if (type === TransformationType.CLASS_TO_PLAIN) {
      // This means the transformation is happening when sending a response
    }
  })
  sort?: FindOptionsOrder<Entity>;

  @IsOptional()
  // @IsString()
  @Transform(({ value, key, obj, type, options }) => {
    if (type === TransformationType.PLAIN_TO_CLASS) {
      // This means the transformation is happening when receiving a request

      let filterFields;
      if (value instanceof Array) {
        filterFields = value;
      } else if (typeof value === 'string') {
        filterFields = value.split(',');
      }

      const filtersObj: FindOptionsWhere<Entity> = {};
      filterFields.forEach((field) => {
        const [key, value] = field.split(':');
        (filtersObj as any)[key] = value;
      });

      return filtersObj;
    } else if (type === TransformationType.CLASS_TO_PLAIN) {
      // This means the transformation is happening when sending a response
    }
  })
  filters?: FindOptionsWhere<Entity> = {};
}
