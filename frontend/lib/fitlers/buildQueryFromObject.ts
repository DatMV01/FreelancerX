export type QueryInput<Entity> = {
  page?: number;
  pageSize?: number;
  sorts?: Partial<Record<keyof Entity, "ASC" | "DESC">>;
  filters?: Partial<Record<keyof Entity, any>>;
  fields?: (keyof Entity)[];
  keyword?: string;
  actor: 'admin' | 'buyer'| 'freelancer'
};

type QueryStringFormat = "comma" | "repeat";

export function buildQueryFromObject<Entity>(
  query: QueryInput<Entity>,
  arrayFormat: QueryStringFormat = "comma", // mặc định: dùng dấu phẩy
): string {
  debugger
  const params = new URLSearchParams();

  if (query.page !== undefined) params.set("page", String(query.page));
  if (query.pageSize !== undefined)
    params.set("pageSize", String(query.pageSize));
  if (query.keyword !== undefined) params.set("keyword", query.keyword);

  if (query.sorts && Object.keys(query.sorts).length > 0) {
    const sortString = Object.entries(query.sorts)
      .map(([key, value]) => `${key}:${value}`)
      .join(",");
    params.set("sorts", sortString);
  }

  if (query.filters && Object.keys(query.filters).length > 0) {
    for (const [key, value] of Object.entries(query.filters)) {
      if (Array.isArray(value)) {
        if (arrayFormat === "comma") {
          params.append("filters", `${key}:${value.join(",")}`);
        } else {
          value.forEach((v) => params.append("filters", `${key}:${v}`));
        }
      } else {
        params.append("filters", `${key}:${value}`);
      }
    }
  }

  if (query.fields && query.fields.length > 0) {
    if (arrayFormat === "comma") {
      params.set("fields", query.fields.join(","));
    } else {
      query.fields.forEach((f) => params.append("fields", f as string));
    }
  }

  return params.toString();
}

export function buildObjectFromQuery<Entity>(
  queryString: string,
  arrayFormat: QueryStringFormat = "comma"
): QueryInput<Entity> {
  const params = new URLSearchParams(queryString);
  const result: QueryInput<Entity> = {};

  // page và pageSize
  if (params.has("page")) result.page = parseInt(params.get("page")!, 10);
  if (params.has("pageSize"))
    result.pageSize = parseInt(params.get("pageSize")!, 10);

  // keyword
  if (params.has("keyword")) result.keyword = params.get("keyword")!;

  // sorts
  if (params.has("sorts")) {
    const sorts = params
      .get("sorts")!
      .split(",")
      .reduce<Partial<Record<keyof Entity, "ASC" | "DESC">>>((acc, pair) => {
        const [key, value] = pair.split(":");
        acc[key as keyof Entity] = value.toUpperCase() as "ASC" | "DESC";
        return acc;
      }, {});
    result.sorts = sorts;
  }

  // filters
  if (params.has("filters")) {
    const filters: Partial<Record<keyof Entity, any>> = {};
    params.getAll("filters").forEach((filter) => {
      const [key, value] = filter.split(":");
      if (value.includes(",")) {
        // Xử lý array filter
        filters[key as keyof Entity] = arrayFormat === "comma" ? value.split(",") : value.split(",");
      } else {
        filters[key as keyof Entity] = value;
      }
    });
    result.filters = filters;
  }

  // fields
  if (params.has("fields")) {
    const fields = params.getAll("fields").map((field) => field as keyof Entity);
    result.fields = fields;
  }

  return result;
}


export function buildObjectFromSearchParams<Entity>(
  searchParams: URLSearchParams,
): QueryInput<Entity> {
  const page = searchParams.get("page");
  const pageSize = searchParams.get("pageSize");
  const keyword = searchParams.get("keyword") || "";

  // Parse filters
  const filtersRaw = searchParams.getAll("filters"); // Lấy tất cả filters
  const filters: Record<string, any> = {};

  for (const entry of filtersRaw) {
    const [key, rawValue] = entry.split(":");
    if (!key || rawValue === undefined) continue;

    // Nếu là chuỗi có dấu phẩy → mảng
    if (rawValue.includes(",")) {
      filters[key] = rawValue.split(",").map((v) => v.trim());
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
  const sortsRaw = searchParams.get("sorts");
  const sorts: Record<string, "ASC" | "DESC"> = {};
  if (sortsRaw) {
    for (const part of sortsRaw.split(",")) {
      const [key, dir] = part.split(":");
      if (key && dir) sorts[key] = dir.toUpperCase() as "ASC" | "DESC";
    }
  }

  // Parse fields: id,title,name hoặc fields=id&fields=title
  const fieldsRaw = searchParams.getAll("fields");
  const fields = fieldsRaw.flatMap((item) =>
    item.includes(",") ? item.split(",") : [item],
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

// 👉 Output:
/// page=2&limit=20&sorts=name:ASC,createdAt:DESC&filters=name:like_admin,status:[active;inactive],createdAt:>=2024-01-01&fields=id,name,status

const queryString: QueryInput<any> = {
  filters: {
    status: ["PENDING", "ACCEPTED"],
    type: "like_task",
  },
  fields: ["id", "title"],
};

// 👇 comma format (mặc định)
//buildQueryFromObject(queryString, "comma");
// → filters=status:PENDING,ACCEPTED&filters=type:like_task&fields=id,title

// 👇 repeat format
//buildQueryFromObject(queryString, "repeat");
// → filters=status:PENDING&filters=status:ACCEPTED&filters=type:like_task&fields=id&fields=title

// URL:
// ?page=1&pageSize=10&keyword=design
// &filters=status:PENDING,ACCEPTED&filters=type:like_task
// &sorts=createdAt:DESC
// &fields=id,title

// 
// {
//   page: 1,
//   pageSize: 10,
//   keyword: 'design',
//   filters: {
//     status: ['PENDING', 'ACCEPTED'],
//     type: 'like_task'
//   },
//   sorts: {
//     createdAt: 'DESC'
//   },
//   fields: ['id', 'title']
// }
