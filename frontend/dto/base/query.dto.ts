export class QueryDto<T> {
  page: number = 1;
  limit: number = 10;

  get _limit(): number {
    return Math.min(this.limit || 10, 50);
  }

  sort?: Record<keyof T, "asc" | "desc"> = {} as Record<
    keyof T,
    "asc" | "desc"
  >;

  filters?: string;
}
