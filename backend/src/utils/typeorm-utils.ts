import {
  Between,
  FindOptionsOrder,
  FindOptionsWhere,
  In,
  IsNull,
  Like,
  Not,
} from 'typeorm';

export type QueryInput<Entity> = {
  page: number;
  pageSize: number;
  sorts?: Partial<Record<keyof Entity, 'ASC' | 'DESC'>>;
  filters?: Partial<Record<keyof Entity, any>>;
  fields?: (keyof Entity)[];
  keyword?: string;
};

type QueryStringFormat = 'comma' | 'repeat';

export function buildObjectFromQuery<Entity>(
  queryString: string,
  arrayFormat: QueryStringFormat = 'comma',
): QueryInput<Entity> {
  const params = new URLSearchParams(queryString);
  const result: QueryInput<Entity> = { page: 1, pageSize: 10 };

  // page và pageSize
  if (params.has('page')) result.page = parseInt(params.get('page')!, 10);
  if (params.has('pageSize'))
    result.pageSize = parseInt(params.get('pageSize')!, 10);

  // keyword
  if (params.has('keyword')) result.keyword = params.get('keyword')!;

  // sorts
  if (params.has('sorts')) {
    const sorts = params
      .get('sorts')!
      .split(',')
      .reduce<Partial<Record<keyof Entity, 'ASC' | 'DESC'>>>((acc, pair) => {
        const [key, value] = pair.split(':');
        acc[key as keyof Entity] = value.toUpperCase() as 'ASC' | 'DESC';
        return acc;
      }, {});
    result.sorts = sorts;
  }

  // filters
  if (params.has('filters')) {
    const filters: Partial<Record<keyof Entity, any>> = {};
    params.getAll('filters').forEach((filter) => {
      const [key, value] = filter.split(':');
      if (value.includes(',')) {
        // Xử lý array filter
        filters[key as keyof Entity] =
          arrayFormat === 'comma' ? value.split(',') : value.split(',');
      } else {
        filters[key as keyof Entity] = value;
      }
    });
    result.filters = filters;
  }

  // fields
  if (params.has('fields')) {
    const fields = params
      .getAll('fields')
      .map((field) => field as keyof Entity);
    result.fields = fields;
  }

  return result;
}

export function buildObjectFromQuerySearchParams<Entity>(
  searchParams: URLSearchParams,
): QueryInput<Entity> {
  const page = searchParams.get('page');
  const pageSize = searchParams.get('pageSize');
  const keyword = searchParams.get('keyword') || '';

  // Parse filters
  const filtersRaw = searchParams.getAll('filters'); // Lấy tất cả filters
  const filters: Record<string, any> = {};

  for (const entry of filtersRaw) {
    const [key, rawValue] = entry.split(':');
    if (!key || rawValue === undefined) continue;

    // Nếu là chuỗi có dấu phẩy → mảng
    if (rawValue.includes(',')) {
      filters[key] = rawValue.split(',').map((v) => v.trim());
    } else {
      // Có thể nhiều filters cùng key → gom vào mảng
      if (filters[key]) {
        if (Array.isArray(filters[key])) {
          filters[key].push(rawValue);
        } else {
          filters[key] = [filters[key], rawValue];
        }
      } else {
        filters[key] = rawValue;
      }
    }
  }

  // Parse sorts: createdAt:DESC,updatedAt:ASC
  const sortsRaw = searchParams.get('sorts');
  const sorts: Record<string, 'ASC' | 'DESC'> = {};
  if (sortsRaw) {
    for (const part of sortsRaw.split(',')) {
      const [key, dir] = part.split(':');
      if (key && dir) sorts[key] = dir.toUpperCase() as 'ASC' | 'DESC';
    }
  }

  // Parse fields: id,title,name hoặc fields=id&fields=title
  const fieldsRaw = searchParams.getAll('fields');
  const fields = fieldsRaw.flatMap((item) =>
    item.includes(',') ? item.split(',') : [item],
  );

  return {
    page: page ? Number(page) : 1,
    pageSize: pageSize ? Number(pageSize) : 10,
    keyword,
    filters,
    sorts,
    fields: fields.length > 0 ? (fields as (keyof Entity)[]) : undefined,
  } as any;
}

export function buildWhereClause<Entity>(
  filters?: FindOptionsWhere<Entity>,
): FindOptionsWhere<Entity> {
  if (!filters) return {};

  return Object.entries(filters).reduce((acc, [key, value]) => {
    if (value === undefined || value === null) return acc;

    if (Array.isArray(value)) {
      acc[key] = In(value);
      return acc;
    }

    if (typeof value === 'string') {
      const v = value.trim();

      // LIKE
      if (v.toLowerCase().startsWith('like_')) {
        acc[key] = Like(`%${v.slice(5)}%`);
      }

      // NOT
      else if (v.toLowerCase().startsWith('not_')) {
        acc[key] = Not(v.slice(4));
      }

      // BETWEEN
      else if (v.toLowerCase().startsWith('between_')) {
        const [_, from, to] = v.split('_');
        if (from && to) acc[key] = Between(from, to);
      }

      // IN (string based): in_1,2,3
      else if (v.toLowerCase().startsWith('in_')) {
        const items = v
          .slice(3)
          .split(',')
          .map((i) => i.trim());
        acc[key] = In(items);
      }

      // IS NULL
      else if (v.toLowerCase() === 'null' || v.toLowerCase() === 'isnull') {
        acc[key] = IsNull();
      }

      // Comparison operators
      else if (/^(>=|<=|>|<|=)_/.test(v)) {
        const [op, val] = v.split(/_(.+)/); // split once
        acc[key] = { [op]: val } as any;
      }

      // Default: equals
      else {
        acc[key] = v;
      }
    } else {
      // fallback: raw value (boolean, number, etc.)
      acc[key] = value;
    }

    return acc;
  }, {} as FindOptionsWhere<Entity>);
}

export function buildOrderClause<Entity>(
  sorts?: FindOptionsOrder<Entity>,
): FindOptionsOrder<Entity> {
  if (!sorts) return {};
  return Object.fromEntries(
    Object.entries(sorts).map(([key, order]) => [
      key,
      (order as string).toUpperCase() as 'ASC' | 'DESC',
    ]),
  ) as FindOptionsOrder<Entity>;
}

export function buildOrderClause2<Entity>(
  sorts?: Partial<Record<keyof Entity, string>>,
): FindOptionsOrder<Entity> {
  if (!sorts) return {};

  return Object.entries(sorts).reduce((acc, [key, value]) => {
    const direction = (String(value) || '').toUpperCase();
    if (direction === 'ASC' || direction === 'DESC') {
      acc[key as keyof Entity as any] = direction;
    }
    return acc;
  }, {} as FindOptionsOrder<Entity>);
}
