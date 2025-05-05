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

// --------------------
// Serialize helpers
// --------------------

function serializeSorts(sorts: any) {
  return Object.entries(sorts)
    .map(([key, dir]) => `${key}:${dir}`)
    .join(',');
}

function serializeFilters(filters: any) {
  return Object.entries(filters)
    .map(([key, value]) => {
      if (value === undefined || value === null) return '';
      if (Array.isArray(value)) return `${key}:in_${value.join(';')}`;
      if (typeof value === 'object' && value !== null) {
        const op = Object.keys(value)[0];
        return `${key}:${op}_${value[op]}`;
      }
      return `${key}:${value}`;
    })
    .filter(Boolean)
    .join(',');
}

// --------------------
// Filter parsing helpers
// --------------------

function parseFilters<Entity>(
  filtersRaw: string,
): Partial<Record<keyof Entity, any>> {
  const filters: Partial<Record<keyof Entity, any>> = {};
  filtersRaw.split(',').forEach((item) => {
    const [key, rawVal] = item.split(':');
    if (!key || !rawVal) return;

    let value: any;
    if (rawVal.startsWith('in_')) {
      value = rawVal
        .slice(3)
        .split(';')
        .map((v) => v.trim());
    } else if (/^([a-zA-Z]+)_/.test(rawVal)) {
      value = rawVal; // special operator, preserve as string
    } else {
      value = isNaN(Number(rawVal)) ? rawVal : Number(rawVal);
    }

    filters[key as keyof Entity] = value;
  });

  return filters;
}

// --------------------
// Exported functions
// --------------------

export function buildQueryFromObject<Entity>(
  query: QueryInput<Entity>,
): string {
  const params = new URLSearchParams();
  params.set('page', String(query.page || 1));
  params.set('pageSize', String(query.pageSize || 10));

  if (query.sorts && Object.keys(query.sorts).length) {
    params.set('sorts', serializeSorts(query.sorts));
  }

  if (query.filters && Object.keys(query.filters).length) {
    params.set('filters', serializeFilters(query.filters));
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
  query: string | URLSearchParams,
): QueryInput<Entity> {
  const params = new URLSearchParams(query);
  const page = parseInt(params.get('page') || '1');
  const pageSize = parseInt(params.get('pageSize') || '10');

  const sortsRaw = params.get('sorts');
  const sorts = sortsRaw
    ? (Object.fromEntries(
        sortsRaw.split(',').map((s) => {
          const [key, dir] = s.split(':');
          return [key, dir?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'];
        }),
      ) as Partial<Record<keyof Entity, 'ASC' | 'DESC'>>)
    : undefined;

  const filtersRaw = params.get('filters');
  const filters = filtersRaw
    ? (parseFilters<Entity>(filtersRaw) as Partial<
        Record<string | keyof Entity, any>
      >)
    : undefined;

  const fields = params.get('fields')?.split(',') as
    | (keyof Entity)[]
    | undefined;
  const keyword = params.get('keyword') || undefined;

  return { page, pageSize, filters, sorts, fields, keyword };
}

export function parseOperatorValue(value: string) {
  const v = value.trim();
  if (v.toLowerCase().startsWith('like_')) return Like(`%${v.slice(5)}%`);
  if (v.toLowerCase().startsWith('contains_')) return Like(`%${v.slice(9)}%`);
  if (v.toLowerCase().startsWith('startsWith_')) return Like(`${v.slice(11)}%`);
  if (v.toLowerCase().startsWith('endsWith_')) return Like(`%${v.slice(10)}`);
  if (v.toLowerCase().startsWith('not_')) return Not(v.slice(4));
  if (v.toLowerCase().startsWith('between_')) {
    const [, from, to] = v.split('_');
    return from && to ? Between(from, to) : undefined;
  }
  if (v.toLowerCase().startsWith('in_'))
    return In(
      v
        .slice(3)
        .split(';')
        .map((s) => s.trim()),
    );
  if (v.toLowerCase() === 'null' || v.toLowerCase() === 'isnull')
    return IsNull();
  if (/^(>=|<=|>|<|=)_/.test(v)) {
    const [op, val] = v.split(/_(.+)/);
    return { [op]: val };
  }
  return v;
}

export function buildWhereClause<Entity>(
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
