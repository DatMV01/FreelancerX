export class QueryDto<Entity> {
  page: number = 1;

  pageSize: number = 10;

  sorts?: any;

  filters?: any;

  fields?: (keyof Entity)[];
}
