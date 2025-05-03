export type QueryInput<Entity> = {
  page?: number;
  pageSize?: number;
  sorts?: Partial<Record<keyof Entity, "ASC" | "DESC">>;
  filters?: Partial<Record<keyof Entity, any>>;
  fields?: (keyof Entity)[];
};

export function buildQueryFromObject<Entity>(
  query: QueryInput<Entity>,
): string {
  const params = new URLSearchParams();

  if (query.page) params.append("page", query.page.toString());
  if (query.pageSize) params.append("pageSize", query.pageSize.toString());

  if (query.sorts) {
    const sorts = Object.entries(query.sorts)
      .map(([key, order]) => `${key}:${order}`)
      .join(",");
    if (sorts) params.append("sorts", sorts);
  }

  if (query.filters) {
    const filters = Object.entries(query.filters)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return `${key}:[${value.join(";")}]`;
        }
        return `${key}:${value}`;
      })
      .join(",");
    if (filters) params.append("filters", filters);
  }

  if (query.fields?.length) {
    params.append("fields", query.fields.join(","));
  }

  return params.toString();
}

const queryString = buildQueryFromObject({
  page: 2,
  pageSize: 20,
  sorts: { name: "ASC", createdAt: "DESC" },
  filters: {
    name: "like_admin",
    status: ["active", "inactive"],
    createdAt: ">=2024-01-01",
  },
  fields: ["id", "name", "status"],
} as any);

// 👉 Output:
/// page=2&limit=20&sorts=name:ASC,createdAt:DESC&filters=name:like_admin,status:[active;inactive],createdAt:>=2024-01-01&fields=id,name,status
