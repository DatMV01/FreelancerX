export class PageOptionsDto {
  readonly page: number = 1;

  readonly limit: number = 10;

  sort?: any;

  filters?: any;
}
