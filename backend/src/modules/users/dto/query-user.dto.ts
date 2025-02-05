import { Transform, Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class QueryUserDto {
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

  @IsOptional()
  @Transform(({ value }) =>
    String(value).trim().length != 0
      ? String(value).trim().split(',')
      : undefined,
  )
  status?: string[];

  @IsOptional()
  @Transform(({ value }) =>
    String(value).trim().length != 0
      ? String(value).trim().split(',')
      : undefined,
  )
  roles?: string[];

  @IsOptional()
  @Transform(({ value }) =>
    String(value).trim().length != 0
      ? String(value).trim().split(';')
      : undefined,
  )
  sort?: string[];
}
