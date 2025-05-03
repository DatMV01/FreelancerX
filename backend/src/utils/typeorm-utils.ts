import {
  Between,
  FindOptionsOrder,
  FindOptionsWhere,
  In,
  IsNull,
  Like,
  Not,
} from 'typeorm';

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
