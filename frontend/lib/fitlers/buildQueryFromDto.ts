import { QueryDto } from "@/dto/base/query.dto";
import { WalletTransactionEntity } from "@/features/wallet/wallet.type";

export function buildQueryFromDto<Entity>(dto: QueryDto<Entity>): string {
  const params = new URLSearchParams();

  if (dto.page) params.append("page", dto.page.toString());
  if (dto.pageSize) params.append("pageSize", dto.pageSize.toString());

  if (dto.sorts) {
    const sorts = Object.entries(dto.sorts)
      .map(([key, order]) => `${key}:${order}`)
      .join(",");
    if (sorts) params.append("sorts", sorts);
  }

  if (dto.filters) {
    const filters = Object.entries(dto.filters)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return `${key}:[${value.join(";")}]`;
        }
        return `${key}:${value}`;
      })
      .join(",");
    if (filters) params.append("filters", filters);
  }

  if (dto.fields?.length) {
    params.append("fields", dto.fields.join(","));
  }

  return params.toString();
}

const queryDto: QueryDto<WalletTransactionEntity> = {
  page: 2,
  pageSize: 10,
  sorts: { createdAt: "DESC" },
  filters: { status: "active" },
  fields: ["id", "status"],
};

const queryString = buildQueryFromDto(queryDto);

// Output:
// page=2&limit=10&sorts=name:ASC,createdAt:DESC&filters=status:active,name:like_admin&fields=id,name,status
