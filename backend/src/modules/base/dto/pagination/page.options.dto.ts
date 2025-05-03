import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PageOptionsDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  @ApiPropertyOptional()
  readonly page: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  @ApiPropertyOptional()
  readonly pageSize: number = 10;

  @IsOptional()
  @ApiPropertyOptional()
  sorts?: any;

  @IsOptional()
  @ApiPropertyOptional()
  filters?: any;
}
