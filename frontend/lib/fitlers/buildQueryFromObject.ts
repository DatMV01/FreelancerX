export type QueryInput<Entity> = {
  page: number;
  pageSize: number;
  sorts?: Partial<Record<keyof Entity, "ASC" | "DESC">>;
  filters?: Partial<Record<keyof Entity, any>>;
  fields?: (keyof Entity)[];
  keyword?: string;
};

export function buildQueryFromObject<Entity>(
  query: QueryInput<Entity>,
): string {
  const params = new URLSearchParams();

  params.set("page", (query.page ?? 1).toString());
  params.set("pageSize", (query.pageSize ?? 10).toString());

  if (query.sorts) {
    const sortStr = Object.entries(query.sorts)
      .map(([key, value]) => `${key}:${value}`)
      .join(",");
    params.set("sorts", sortStr);
  }

  if (query.filters) {
    const filterStr = Object.entries(query.filters)
      .map(([key, value]) => {
        // Giá trị undefined/null không cần encode
        if (value === undefined || value === null) return null;

        if (Array.isArray(value)) {
          return `${key}:in_${value.join(";")}`; // Dùng dấu `;` cho các mảng
        }

        if (typeof value === "object" && value !== null) {
          // Các toán tử đặc biệt (ví dụ: { '>': 10 })
          const op = Object.keys(value)[0];
          const val = (value as Record<string, any>)[op];
          return `${key}:${op}_${val}`;
        }

        return `${key}:${value}`;
      })
      .filter(Boolean)
      .join(",");
    if (filterStr) params.set("filters", filterStr);
  }

  if (query.fields?.length) {
    params.set("fields", query.fields.join(","));
  }

  if (query.keyword) {
    params.set("keyword", query.keyword);
  }

  return params.toString();
}

export function buildObjectFromQuery<Entity>(
  query: string | URLSearchParams,
): QueryInput<Entity> {
  //const params = typeof query === 'string' ? new URLSearchParams(query) : query;

  const params = new URLSearchParams(query);
  const page = parseInt(params.get("page") || "1", 10);
  const pageSize = parseInt(params.get("pageSize") || "10", 10);

  const filtersRaw = params.get("filters");
  const filters: Partial<Record<keyof Entity, any>> = {};

  if (filtersRaw) {
    filtersRaw.split(",").forEach((item) => {
      const [key, rawVal] = item.split(":");
      if (!key || !rawVal) return;

      // Kiểm tra xem giá trị có phải là mảng không (dấu in_)
      if (rawVal.startsWith("in_")) {
        const values = rawVal
          .slice(3)
          .split(";")
          .map((v) => v.trim()); // Đổi từ in_x,y,z thành ['x', 'y', 'z']
        filters[key as keyof Entity] = values;
      }
      // Kiểm tra các toán tử đặc biệt khác
      else if (
        rawVal.startsWith("like_") ||
        rawVal.startsWith("not_") ||
        rawVal.startsWith("contains_") ||
        rawVal.startsWith("startsWith_") ||
        rawVal.startsWith("endsWith_") ||
        rawVal.startsWith("between_") ||
        rawVal.startsWith(">=_") ||
        rawVal.startsWith("<=_") ||
        rawVal.toLowerCase() === "null" ||
        rawVal.toLowerCase() === "isnull"
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

  const sortsRaw = params.get("sorts");
  const sorts = sortsRaw
    ? (Object.fromEntries(
        sortsRaw.split(",").map((item) => {
          const [key, dir] = item.split(":");
          return [key, dir.toUpperCase() === "DESC" ? "DESC" : "ASC"];
        }),
      ) as Partial<Record<keyof Entity, "ASC" | "DESC">>)
    : undefined;

  const fieldsRaw = params.get("fields");
  const fields = fieldsRaw
    ? (fieldsRaw.split(",") as (keyof Entity)[])
    : undefined;

  const keyword = params.get("keyword") || undefined;

  return {
    page,
    pageSize,
    filters,
    sorts,
    fields,
    keyword,
  };
}

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
