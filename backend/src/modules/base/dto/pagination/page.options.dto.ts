import { Transform, Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PageOptionsDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  readonly limit: number = 10;

  @IsOptional()
  sort?: any;

  @IsOptional()
  filters?: any;
}
