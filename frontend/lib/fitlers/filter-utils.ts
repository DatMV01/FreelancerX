export type FilterOperator =
  | `like_${string}`
  | `not_${string}`
  | `between_${string}_${string}`
  | `in_${string}`
  | "null"
  | "isnull"
  | `>${string}`
  | `>=${string}`
  | `<${string}`
  | `<=${string}`
  | `=${string}`;

export function buildFilterString(filters: Record<string, any>): string {
  return Object.entries(filters)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return `${key}:[${value.join(";")}]`;
      }
      return `${key}:${value}`;
    })
    .join(",");
}

export function buildSortString(sorts: Record<string, "ASC" | "DESC">): string {
  return Object.entries(sorts)
    .map(([key, order]) => `${key}:${order}`)
    .join(",");
}

const query = {
  page: 1,
  pageSize: 10,
  sorts: buildSortString({ name: "ASC", createdAt: "DESC" }),
  filters: buildFilterString({
    name: "like_admin",
    status: ["active", "inactive"],
    createdAt: ">=2024-01-01",
  }),
};

const queryString = new URLSearchParams({
  ...query,
  page: query.page.toString(),
  pageSize: query.pageSize.toString(),
}).toString();
// -> page=1&limit=10&sorts=name:ASC,createdAt:DESC&filters=name:like_admin,status:[active;inactive],createdAt:>=2024-01-01
