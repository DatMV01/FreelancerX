import { PageMetaDtoParameters } from './page.meta.interface';

export class PageMetaDto {
  readonly page: number;

  readonly limit: number;

  readonly itemCount: number;

  readonly pageCount?: number;

  readonly hasPreviousPage?: boolean;

  readonly hasNextPage?: boolean;

  readonly sorts?: any;

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
