import {
  Between,
  Equal,
  FindOptionsOrder,
  FindOptionsWhere,
  In,
  IsNull,
  LessThan,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
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

export function buildQueryFromObject<Entity>(
  query: QueryInput<Entity>,
): string {
  const params = new URLSearchParams();

  params.set('page', (query.page ?? 1).toString());
  params.set('pageSize', (query.pageSize ?? 10).toString());

  if (query.sorts) {
    const sortStr = Object.entries(query.sorts)
      .map(([key, value]) => `${key}:${value}`)
      .join(',');
    params.set('sorts', sortStr);
  }

  if (query.filters) {
    const filterStr = Object.entries(query.filters)
      .map(([key, value]) => {
        // Giá trị undefined/null không cần encode
        if (value === undefined || value === null) return null;

        if (Array.isArray(value)) {
          return `${key}:in_${value.join(';')}`; // Dùng dấu `;` cho các mảng
        }

        if (typeof value === 'object' && value !== null) {
          // Các toán tử đặc biệt (ví dụ: { '>': 10 })
          const op = Object.keys(value)[0];
          const val = (value as Record<string, any>)[op];
          return `${key}:${op}_${val}`;
        }

        return `${key}:${value}`;
      })
      .filter(Boolean)
      .join(',');
    if (filterStr) params.set('filters', filterStr);
  }

  if (query.fields?.length) {
    params.set('fields', query.fields.join(','));
  }

  if (query.keyword) {
    params.set('keyword', query.keyword);
  }

  return params.toString();
}

export function buildObjectFromQuery<Entity>(
  query: string,
): QueryInput<Entity> {
  console.log(query)
  const decoded = decodeURIComponent(query);
  const params = new URLSearchParams(decoded);

  const page = parseInt(params.get('page') || '1', 10);
  const pageSize = parseInt(params.get('pageSize') || '10', 10);

  const filtersRaw = params.get('filters');
  const filters: Partial<Record<keyof Entity, any>> = {};

  if (filtersRaw) {
    filtersRaw.split(',').forEach((item) => {
      const [key, rawVal] = item.split(':');
      if (!key || !rawVal) return;

      // Kiểm tra xem giá trị có phải là mảng không (dấu in_)
      if (rawVal.startsWith('in_')) {
        const values = rawVal
          .slice(3)
          .split(';')
          .map((v) => v.trim()); // Đổi từ in_x,y,z thành ['x', 'y', 'z']
        filters[key as keyof Entity] = values;
      }
      // Kiểm tra các toán tử đặc biệt khác
      else if (
        rawVal.startsWith('like_') ||
        rawVal.startsWith('not_') ||
        rawVal.startsWith('contains_') ||
        rawVal.startsWith('startsWith_') ||
        rawVal.startsWith('endsWith_') ||
        rawVal.startsWith('between_') ||
        rawVal.startsWith('>=_') ||
        rawVal.startsWith('<=_') ||
        rawVal.toLowerCase() === 'null' ||
        rawVal.toLowerCase() === 'isnull'
      ) {
        filters[key as keyof Entity] = rawVal;
      } else {
        // Nếu không phải các toán tử đặc biệt, thì gán luôn giá trị vào
        filters[key as keyof Entity] = isNaN(Number(rawVal))
          ? rawVal
          : Number(rawVal);
      }
    });
  }

  const sortsRaw = params.get('sorts');
  const sorts = sortsRaw
    ? (Object.fromEntries(
        sortsRaw.split(',').map((item) => {
          const [key, dir] = item.split(':');
          return [key, dir.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'];
        }),
      ) as Partial<Record<keyof Entity, 'ASC' | 'DESC'>>)
    : undefined;

  const fieldsRaw = params.get('fields');
  const fields = fieldsRaw
    ? (fieldsRaw.split(',') as (keyof Entity)[])
    : undefined;

  const keyword = params.get('keyword') || undefined;

  return {
    page,
    pageSize,
    filters,
    sorts,
    fields,
    keyword,
  };
}

function parseOperatorValue(value: string): any {
  const v = value.trim().toLowerCase();

  if (v.startsWith('like_')) return Like(`%${value.slice(5)}%`);
  if (v.startsWith('contains_')) return Like(`%${value.slice(9)}%`);
  if (v.startsWith('startswith_')) return Like(`${value.slice(11)}%`);
  if (v.startsWith('endswith_')) return Like(`%${value.slice(10)}`);
  if (v.startsWith('not_')) return Not(value.slice(4));
  if (v.startsWith('between_')) {
    const [, from, to] = value.split('_');
    return from && to ? Between(from, to) : undefined;
  }
  if (v.startsWith('in_'))
    return In(
      value
        .slice(3)
        .split(';')
        .map((s) => s.trim()),
    );
  if (v === 'null' || v === 'isnull') return IsNull();

  if (/^(>=|<=|>|<|=)_/.test(value)) {
    const [op, val] = value.split(/_(.+)/);
    switch (op) {
      case '>':
        return MoreThan(val);
      case '>=':
        return MoreThanOrEqual(val);
      case '<':
        return LessThan(val);
      case '<=':
        return LessThanOrEqual(val);
      case '=':
        return Equal(val);
      default:
        return val;
    }
  }

  return isNaN(Number(value)) ? value : Number(value);
}

export function buildWhereClause<Entity>(
  filters?: Partial<Record<string, any>>,
): FindOptionsWhere<Entity> {
  if (!filters) return {};

  const setNestedValue = (obj: any, path: string[], value: any) => {
    const key = path[0];
    if (path.length === 1) {
      obj[key] = value;
    } else {
      obj[key] = obj[key] || {};
      setNestedValue(obj[key], path.slice(1), value);
    }
  };

  const where: FindOptionsWhere<Entity> = {};

  for (const [key, raw] of Object.entries(filters)) {
    if (raw === undefined || raw === null) continue;

    const keys = key.split('.');
    const value = Array.isArray(raw)
      ? In(raw)
      : typeof raw === 'string'
        ? parseOperatorValue(raw)
        : raw;

    setNestedValue(where, keys, value);
  }

  return where;
}

export function buildWhereClause2<Entity>(
  filters?: Partial<Record<string, any>>,
): FindOptionsWhere<Entity> {
  if (!filters) return {};

  const where: FindOptionsWhere<Entity> = {};

  for (const [key, raw] of Object.entries(filters)) {
    if (raw === undefined || raw === null) continue;

    const path = key.split('.');
    const value = Array.isArray(raw)
      ? In(raw)
      : typeof raw === 'string'
        ? parseOperatorValue(raw)
        : raw;

    let obj: any = where;
    for (let i = 0; i < path.length - 1; i++) {
      obj[path[i]] = obj[path[i]] || {};
      obj = obj[path[i]];
    }
    obj[path[path.length - 1]] = value;
  }

  return where;
}

export function buildOrderClause<Entity>(
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
