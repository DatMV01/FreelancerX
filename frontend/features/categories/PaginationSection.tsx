import { PageMetaDto } from "@/dto/base/pagination";
import { useQuerySync } from "@/hooks/useQuerySync";
import { Pagination } from "@mui/material";
import { GigEntity } from "../gig/gig.entity";

const PaginationSection = ({
  pageMetaData,
}: {
  pageMetaData?: Partial<PageMetaDto>;
}) => {
  const { query, queryString, queryStringDecode, url, setQuery, resetQuery } =
    useQuerySync<GigEntity>({} as any);

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setQuery({ page: value });
    setQuery({ pageSize: 50 });
  };

  const page = Number(pageMetaData?.page ?? query.page ?? 1);
  const count = Number(pageMetaData?.pageCount ?? 1);

  return (
    <Pagination
      className="my-8 flex justify-center"
      boundaryCount={3}
      count={count}
      page={page}
      onChange={handleChange}
    />
  );
};

export default PaginationSection;
