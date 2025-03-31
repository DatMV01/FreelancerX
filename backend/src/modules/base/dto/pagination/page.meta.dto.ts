import { ApiProperty } from '@nestjs/swagger';
import { PageMetaDtoParameters } from './page.meta.interface';

export class PageMetaDto {
  @ApiProperty()
  readonly page: number;

  @ApiProperty()
  readonly limit: number;

  @ApiProperty()
  readonly itemCount: number;

  @ApiProperty()
  readonly pageCount?: number;

  @ApiProperty()
  readonly hasPreviousPage?: boolean;

  @ApiProperty()
  readonly hasNextPage?: boolean;

  @ApiProperty()
  readonly sorts?: any;

  @ApiProperty()
  readonly filter?: any;

  constructor({ pageOptionsDto, itemCount }: PageMetaDtoParameters) {
    this.page = pageOptionsDto.page;
    this.limit = pageOptionsDto.limit;
    this.sorts = pageOptionsDto.sorts;
    this.filter = pageOptionsDto.filters;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.limit);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}
