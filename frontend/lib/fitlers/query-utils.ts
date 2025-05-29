export type QueryInput<Entity> = {
  page: number;
  pageSize: number;
  sorts?: Partial<Record<keyof Entity, "ASC" | "DESC">>;
  filters?: Partial<Record<keyof Entity, any>>;
  fields?: (keyof Entity)[];
  keyword?: string;
};
function flatten(
  obj: Record<string, any>,
  parentKey = "",
): Record<string, any> {
  const result: Record<string, any> = {};

  for (const key in obj) {
    const value = obj[key];
    const fullKey = parentKey ? `${parentKey}.${key}` : key;

    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      Object.assign(result, flatten(value, fullKey));
    } else {
      result[fullKey] = value;
    }
  }

  return result;
}

export function buildQueryFromObject<Entity>(
  query: QueryInput<Entity>,
): string {
  const params = new URLSearchParams();

  params.set("page", query.page?.toString() || "1");
  params.set("pageSize", query.pageSize?.toString() || "10");

  if (query.sorts) {
    const sortStr = Object.entries(query.sorts)
      .map(([key, dir]) => `${key}:${dir}`)
      .join(",");
    params.set("sorts", sortStr);
  }

  if (query.filters) {
    const flatFilters = flatten(query.filters);
    const filterStr = Object.entries(flatFilters)
      .map(([key, val]) => `${key}:${val}`)
      .join(",");
    params.set("filters", filterStr);
  }

  if (query.fields?.length) {
    params.set("fields", query.fields.join(","));
  }

  if (query.keyword) {
    params.set("keyword", query.keyword);
  }

  return params.toString();
}
function setNested(obj: any, path: string[], value: any) {
  const key = path[0];
  if (path.length === 1) {
    obj[key] = value;
  } else {
    obj[key] = obj[key] || {};
    setNested(obj[key], path.slice(1), value);
  }
}

function parsePrimitiveValue(val: string): any {
  if (val === "null") return null;
  if (val === "undefined") return undefined;
  if (val === "true") return true;
  if (val === "false") return false;
  if (!isNaN(Number(val))) return Number(val);
  return val;
}

export function buildObjectFromQuery(query: string): {
  page: number;
  pageSize: number;
  filters?: Record<string, any>;
  sorts?: Record<string, "ASC" | "DESC">;
  fields?: string[];
  keyword?: string;
} {
  const params = new URLSearchParams(decodeURIComponent(query));

  const page = parseInt(params.get("page") || "1", 10);
  const pageSize = parseInt(params.get("pageSize") || "10", 10);

  const filtersRaw = params.get("filters");
  const filters: Record<string, any> = {};

  if (filtersRaw) {
    filtersRaw.split(",").forEach((item) => {
      const [key, val] = item.split(":");
      if (!key || val === undefined) return;
      const path = key.split(".");
      const parsed = parsePrimitiveValue(val);
      setNested(filters, path, parsed);
    });
  }

  const sortsRaw = params.get("sorts");
  const sorts: Record<string, "ASC" | "DESC"> | undefined = sortsRaw
    ? Object.fromEntries(
        sortsRaw.split(",").map((item) => {
          const [key, dir] = item.split(":");
          return [key, dir?.toUpperCase() === "DESC" ? "DESC" : "ASC"];
        }),
      )
    : undefined;

  const fields = params.get("fields")?.split(",") ?? undefined;
  const keyword = params.get("keyword") ?? undefined;

  return {
    page,
    pageSize,
    filters: Object.keys(filters).length ? filters : undefined,
    sorts,
    fields,
    keyword,
  };
}

const queryStr = buildQueryFromObject({
  page: 1,
  pageSize: 20,
  filters: {
    active: true,
    retryCount: 3,
    email: null,
    user: {
      isPremium: "false",
      age: "25",
    },
  },
});

console.log(queryStr);

console.log(buildObjectFromQuery(queryStr));

const query = buildQueryFromObject({
  page: 1,

  sorts: { createdAt: "DESC", updatedAt: "DESC" },
  pageSize: 50,
  filters: {
    status: ["ACTIVE"],
    freelancer: {
      email: "user32@example.com",
    },
  },
} as any);

console.log(query);

console.log(buildObjectFromQuery(query));

const decoded = decodeURIComponent(query);
//console.log(decoded);

const filters = {
  createdAt: "<_2023-01-01", // LessThan (date)
  price: "between_100_500", // Between (number)
  status: "in_pending;completed;rejected", // In (string[])
  name: "like_john", // Like (string)
  description: "contains_offer", // Like (contains)
  title: "startsWith_Gig", // Like (startsWith)
  note: "endsWith_discount", // Like (endsWith)
  "user.email": "not_test@example.com", // Not equal
  "user.age": ">=_18", // MoreThanOrEqual
  "user.isActive": "true", // Boolean
  deletedAt: "null", // IsNull
  rating: "<=_4.5", // LessThanOrEqual (float)
  "meta.type": "=__system__", // Equal exact
};

const input: QueryInput<any> = {
  page: 1,
  pageSize: 20,
  filters: {
    ...filters,
    orderNo: "ORD-20250504124863-Mxk29LdQH8vZ",
    status: ["ACTIVE", "PENDNG", "COMPLETED"],
    createdAt: "between_2023-01-01_2023-12-31",
  },
  sorts: { createdAt: "DESC", updatedAt: "DESC" },
  fields: ["id", "orderNo", "status", "createdAt", "updatedAt"],
};

// Sau khi truyền filters này vào buildWhereClause<Entity>(filters),

// {
//   createdAt: LessThan('2023-01-01'),
//   price: Between('100', '500'),
//   status: In(['pending', 'completed', 'rejected']),
//   name: Like('%john%'),
//   description: Like('%offer%'),
//   title: Like('Gig%'),
//   note: Like('%discount'),
//   user: {
//     email: Not('test@example.com'),
//     age: MoreThanOrEqual('18'),
//     isActive: true
//   },
//   deletedAt: IsNull(),
//   rating: LessThanOrEqual('4.5'),
//   meta: {
//     type: Equal('__system__')
//   }
// }

// const qs = buildQueryFromObject(input);

// const parsed = buildObjectFromQuery<typeof input>(qs);

// console.log(qs);

// console.log(parsed);
