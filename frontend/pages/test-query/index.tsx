import { Button } from "@/components/ui/button";
import { useQuerySync } from "@/hooks/useQuerySync";
import { QueryInput } from "@/lib/fitlers/query-utils";

type Order = {
  id: number;
  status: string;
  createdAt: string;
  amount: number;
  tags: string[];
  buyerId: string;
};

const defaultQuery: QueryInput<any> = {
  page: 1,
  pageSize: 10,
  sorts: { createdAt: "DESC" },
  filters: {
    status: "pending",
    amount: 100,
    tags: ["design", "dev"],
    buyerId: "1234",
  },
  fields: ["id", "status", "amount"],
  keyword: "",
};

export default function OrdersPage() {
  const { query, queryString, setQuery, resetQuery } =
    useQuerySync<Order>(defaultQuery);

  return (
    <div className="flex w-fit flex-wrap gap-2">
      <h1>Danh sách đơn hàng</h1>

      <div>Trang hiện tại: {query.page}</div>
      <div>Số lượng hiển thị: {query.pageSize}</div>

      {/* Thay đổi trang */}
      <Button onClick={() => setQuery({ page: query.page + 1 })}>
        Trang tiếp theo
      </Button>
      <Button onClick={() => setQuery({ page: query.page - 1 })}>
        Trang trước
      </Button>

      {/* Thay đổi kích thước trang */}
      <Button onClick={() => setQuery({ pageSize: 20 })}>
        Hiển thị 20 đơn
      </Button>
      <Button onClick={() => setQuery({ pageSize: 10 })}>
        Hiển thị 10 đơn
      </Button>

      {/* Sắp xếp */}
      <Button onClick={() => setQuery({ sorts: { createdAt: "ASC" } })}>
        Sắp xếp theo ngày tăng dần
      </Button>
      <Button onClick={() => setQuery({ sorts: { amount: "DESC" } })}>
        Sắp xếp theo số tiền giảm dần
      </Button>

      {/* Lọc theo trạng thái đơn hàng */}
      <Button onClick={() => setQuery({ filters: { status: "completed" } })}>
        Lọc trạng thái: Đã hoàn thành
      </Button>
      <Button onClick={() => setQuery({ filters: { status: "pending" } })}>
        Lọc trạng thái: Đang chờ
      </Button>

      {/* Lọc theo số tiền */}
      <Button onClick={() => setQuery({ filters: { amount: 200 } })}>
        Lọc số tiền: 200
      </Button>

      {/* Lọc theo tags */}
      <Button onClick={() => setQuery({ filters: { tags: ["design"] } })}>
        Lọc tags: design
      </Button>
      <Button
        onClick={() => setQuery({ filters: { tags: ["design", "dev"] } })}
      >
        Lọc tags: design, dev
      </Button>

      {/* Tìm kiếm */}
      <Button onClick={() => setQuery({ keyword: "freelancer" })}>
        Tìm kiếm: freelancer
      </Button>

      {/* Chọn các trường hiển thị */}
      <Button onClick={() => setQuery({ fields: ["id", "status"] })}>
        Hiển thị ID và trạng thái
      </Button>

      {/* Reset tất cả các query */}
      <Button onClick={resetQuery}>Reset tất cả</Button>

      <div>
        <pre>{JSON.stringify(query, null, 2)}</pre>
      </div>

      <div>{decodeURIComponent(queryString)}</div>
    </div>
  );
}
