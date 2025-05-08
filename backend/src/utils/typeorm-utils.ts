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

function parseValue(val: string): any {
  if (!isNaN(Number(val))) {
    return Number(val);
  }
  return val;
}

/**
 * Parse chuỗi kiểu toán tử (vd: 'like_abc', '>=_10') thành expression TypeORM
 */
export function parseOperatorValue(raw: string): any {
  if (!raw || typeof raw !== 'string') return raw;

  // isnull hoặc null
  if (raw.toLowerCase() === 'null' || raw.toLowerCase() === 'isnull') {
    return IsNull();
  }

  // like_abc → Like('abc')
  if (raw.startsWith('like_')) {
    return Like(raw.slice(5));
  }

  // not_abc → Not('abc')
  if (raw.startsWith('not_')) {
    return Not(raw.slice(4));
  }

  // in_x;y;z → In(['x', 'y', 'z'])
  if (raw.startsWith('in_')) {
    return In(raw.slice(3).split(';'));
  }

  // between_10;20 → Between(10, 20)
  if (raw.startsWith('between_')) {
    const [from, to] = raw.slice(8).split(';');
    return Between(parseValue(from), parseValue(to));
  }

  // >=_10 → MoreThanOrEqual(10)
  if (raw.startsWith('>=_')) {
    return MoreThanOrEqual(parseValue(raw.slice(3)));
  }

  // <=_20 → LessThanOrEqual(20)
  if (raw.startsWith('<=_')) {
    return LessThanOrEqual(parseValue(raw.slice(3)));
  }

  // >_10 → MoreThan(10)
  if (raw.startsWith('>_')) {
    return MoreThan(parseValue(raw.slice(2)));
  }

  // <_20 → LessThan(20)
  if (raw.startsWith('<_')) {
    return LessThan(parseValue(raw.slice(2)));
  }

  // fallback: trả về string hoặc number
  return parseValue(raw);
}

function parseOperatorValueOld(value: string): any {
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
  filters?: Record<string, any>,
): FindOptionsWhere<Entity> {
  if (!filters) return {};

  const where: FindOptionsWhere<Entity> = {};

  const setNested = (obj: any, path: string[], value: any) => {
    const key = path[0];
    if (path.length === 1) {
      obj[key] = value;
    } else {
      obj[key] = obj[key] || {};
      setNested(obj[key], path.slice(1), value);
    }
  };

  const flattenToEntries = (
    obj: Record<string, any>,
    prefix = '',
  ): [string, any][] => {
    return Object.entries(obj).flatMap(([key, value]) => {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        return flattenToEntries(value, fullKey);
      }
      return [[fullKey, value]];
    });
  };

  const flatEntries = flattenToEntries(filters);

  for (const [flatKey, rawValue] of flatEntries) {
    if (rawValue === undefined || rawValue === null) continue;
    const path = flatKey.split('.');
    const parsedValue = Array.isArray(rawValue)
      ? In(rawValue)
      : typeof rawValue === 'string'
        ? parseOperatorValue(rawValue)
        : rawValue;
    setNested(where, path, parsedValue);
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
