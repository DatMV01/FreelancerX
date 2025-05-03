"use client";

import { useFilterParams } from "@/hooks/useFilterParams";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Stack,
} from "@mui/material";

interface Props {
  totalItems: number;
}

export default function PaginationWithPageSize({ totalItems }: Props) {
  const { params, setParam, setQuery, resetParams, countActiveParams } =
    useFilterParams();

  const pageSize = Number(params?.pageSize ?? 10);
  const page = Number(params?.page ?? 1);

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      justifyContent="center"
      alignItems="center"
      mt={4}
    >
      <FormControl size="small" sx={{ minWidth: 50 }}>
        <InputLabel id="page-size-label">Sizes</InputLabel>
        <Select
          labelId="page-size-label"
          value={pageSize}
          onChange={(e) => {
            e.preventDefault();

            setQuery(`pageSize=${Number(e.target.value)}&page=1`);
          }}
          label="Sizes"
        >
          {[10, 20, 30, 40, 50].map((size) => (
            <MenuItem key={size} value={size}>
              {size}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Pagination
        boundaryCount={3}
        count={totalPages}
        page={page}
        onChange={(_, value) => setParam("page", Number(value))}
      />
    </Stack>
  );
}
