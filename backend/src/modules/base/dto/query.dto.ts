import { Transform, TransformationType, Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { FindOptionsOrder, FindOptionsWhere } from 'typeorm';
import { BaseEntity } from '../entities/base.entity';

export class QueryDto<Entity extends BaseEntity> {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  @Transform(({ value, key, obj, type, options }) => {
    if (type === TransformationType.PLAIN_TO_CLASS) {
      const num = parseInt(value, 10);
      if (isNaN(num) || num < 1) return 10;
      return num > 50 ? 50 : num;
    } else if (type === TransformationType.CLASS_TO_PLAIN) {
      // This means the transformation is happening when sending a response
    }
  })
  limit: number = 10;

  @IsOptional()
  @Transform(({ value, key, obj, type, options }) => {
    if (type === TransformationType.PLAIN_TO_CLASS) {
      // This means the transformation is happening when receiving a request

      // GET /roles?page=1&limit=10&sort=name:desc,id:asc
      const sortObj: FindOptionsOrder<Entity> = {};
      if (value) {
        const sortFields = value.split(',');
        sortFields.forEach((field: string) => {
          const [key, order] = field.split(':');
          (sortObj as any)[key] =
            order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
        });
      }

      if (Object.keys(sortObj).length === 0) {
        // default sort options
        (sortObj as any).updatedAt = 'DESC';
        (sortObj as any).createdAt = 'DESC';
      }

      return sortObj;
    } else if (type === TransformationType.CLASS_TO_PLAIN) {
      // This means the transformation is happening when sending a response
    }
  })
  sorts?: FindOptionsOrder<Entity> = {
    updatedAt: 'DESC',
    createdAt: 'DESC',
  } as FindOptionsOrder<Entity>;

  @IsOptional()
  @Transform(({ value, key, obj, type, options }) => {
    if (type === TransformationType.PLAIN_TO_CLASS) {
      // This means the transformation is happening when receiving a request

      // GET /roles?filters=name:admin,status:active
      // GET /roles?filters=status:[active;inactive]
      const filtersObj: FindOptionsWhere<Entity> = {};
      if (value) {
        const filterFields = value.split(',');
        filterFields.forEach((field: string) => {
          let [key, value] = field.split(':');
          if (value.startsWith('[') && value.endsWith(']')) {
            value = value.replace(/[\[\]]/g, '').split(';') as any;
          }

          (filtersObj as any)[key] = value;
        });
      }
      return filtersObj;
    } else if (type === TransformationType.CLASS_TO_PLAIN) {
      // This means the transformation is happening when sending a response
    }
  })
  filters?: FindOptionsWhere<Entity>;
}
