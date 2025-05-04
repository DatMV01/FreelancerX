import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, TransformationType, Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { FindOptionsOrder, FindOptionsSelect, FindOptionsWhere } from 'typeorm';
import { BaseEntity } from '../entities/base.entity';

export class QueryDto3<Entity extends BaseEntity> {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  @ApiPropertyOptional({ default: 1 })
  page: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  @ApiPropertyOptional({ default: 10 })
  @Transform(({ value, key, obj, type, options }) => {
    if (type === TransformationType.PLAIN_TO_CLASS) {
      const num = parseInt(value, 10);
      if (isNaN(num) || num < 1) return 10;
      return num > 50 ? 50 : num;
    } else if (type === TransformationType.CLASS_TO_PLAIN) {
      // This means the transformation is happening when sending a response
    }
  })
  pageSize: number = 10;

  @IsOptional()
  keyword?: string;

  @IsOptional()
  @ApiPropertyOptional({
    type: String,
  })
  filters?: string[]; // filters=status:in_PENDING,ACCEPTED&filters=type:like_abc

  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    default: 'updatedAt:DESC,createdAt:DESC',
  })
  sorts?: string; // createdAt:DESC,updatedAt:ASC

  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description:
      'Specify the fields you want to get, for example: id,name,email',
  })
  fields?: string[]; // fields=id&fields=name OR fields=id,name
}
