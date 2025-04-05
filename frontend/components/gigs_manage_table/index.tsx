"use client";

import { GigDto, GigStatus } from "@/dto/gig.dto";
import { axiosInstanceV1 } from "@/lib/axios/axiosInstance";
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TablePagination,
  TextField,
} from "@mui/material";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
  DataGrid,
  GridColDef,
  gridPageCountSelector,
  gridPageSelector,
  gridPageSizeSelector,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { uploadGig } from "../gig_add_edit";

import { TablePaginationActionsProps } from "@mui/material/TablePagination/TablePaginationActions";

function TablePaginationActions(props: TablePaginationActionsProps) {
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className="flex">
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        <ChevronFirst />
      </IconButton>

      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        <ChevronLeft />
      </IconButton>

      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        <ChevronRight />
      </IconButton>

      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        <ChevronLast />
      </IconButton>
    </div>
  );
}

const CustomPagination = (
  props: TablePaginationActionsProps & { pageSizeOptions?: number[] },
) => {
  const { pageSizeOptions = [10, 20, 30, 40, 50] } = props;
  const apiRef = useGridApiContext();

  const page = useGridSelector(apiRef, gridPageSelector);

  const pageSize = useGridSelector(apiRef, gridPageSizeSelector);

  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  const currentPage = page + 1;

  const [inputPage, setInputPage] = useState(currentPage);

  useEffect(() => {
    setInputPage(currentPage);
  }, [page]);

  const handlePageChange = () => {
    const targetPage = Math.max(1, Math.min(inputPage, pageCount));
    if (targetPage !== currentPage) {
      setInputPage(targetPage);
    }
    apiRef.current.setPage(targetPage - 1);
  };

  return (
    <div className="flex w-full items-center justify-center">
      <TablePagination
        component="div"
        count={apiRef.current.state.pagination.rowCount ?? 0}
        page={page}
        rowsPerPage={pageSize}
        onPageChange={(event, newPage) => apiRef.current.setPage(newPage)}
        onRowsPerPageChange={(event) =>
          apiRef.current.setPageSize(parseInt(event.target.value, 10))
        }
        ActionsComponent={TablePaginationActions}
        rowsPerPageOptions={pageSizeOptions}
        labelDisplayedRows={({ from, to, count }) =>
          `Page ${currentPage} of ${pageCount}`
        }
      />

      <TextField
        size="small"
        type="number"
        label="Go to page"
        value={inputPage}
        onChange={(e) => setInputPage(Number(e.target.value))}
        style={{ width: 90, marginRight: 10 }}
      />
      <Button variant="contained" size="small" onClick={handlePageChange}>
        Go
      </Button>
    </div>
  );
};

const GigsManageTable = ({
  data,
  gigStatus,
  ...props
}: {
  data: any;
  gigStatus: any;
}) => {
  const [rows, setRows] = useState<GigDto[]>([]);

  const [loadingRows, setLoadingRows] = useState<string[]>([]);

  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 20,
  });

  const [dayRange, setDayRange] = useState(7);

  const [isDeleting, setDeleting] = useState(false);

  const [loading, setLoading] = useState(false);

  const deleteAllGigs = async (gigIds: string[]) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const results = await Promise.all(gigIds.map(deleteGig));
      return results.every((res) => res === true);
    } catch (error) {
      alert("Error deleting gigs:" + error);

      return false;
    }
  };

  const handleDeleteAll = useCallback(async () => {
    if (selectedRows.length === 0) return;
    setLoadingRows(selectedRows);
    setDeleting(true);
    const success = await deleteAllGigs(selectedRows);

    if (success) {
      setRows((prevRows) =>
        prevRows.filter((row) => !selectedRows.includes(row.id)),
      );
      setSelectedRows([]);
    } else {
      alert("Failed to delete some gigs. Please try again.");
    }

    setDeleting(false);
  }, [selectedRows]);

  const deleteGig = async (gigId: string) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const response = await axiosInstanceV1.delete(`gig/${gigId}`);
      return response.status === 200;
    } catch (error) {
      alert(`Error deleting gig ${gigId}: ${error}`);

      return false;
    }
  };

  const handleDeleteRow = useCallback(
    async (gigId: string) => {
      setLoadingRows((prev) => [...prev, gigId]);

      const success = await deleteGig(gigId);
      if (success) {
        setRows((prevRows) => prevRows.filter((row) => row.id !== gigId));
      } else {
        alert(`Failed to delete gig with ID: ${gigId}`);
      }

      setLoadingRows((prev) => prev.filter((id) => id !== gigId));
    },
    [deleteGig],
  );

  const handlePauseRow = useCallback(
    async (row: any) => {
      const gigId = row.id;
      setLoadingRows((prev) => [...prev, gigId]);

      const success = await uploadGig(row, GigStatus.PAUSED);
      if (success) {
        setRows((prevRows) => prevRows.filter((row) => row.id !== gigId));
      } else {
        alert(`Failed to pausing gig with ID: ${gigId}`);
      }

      setLoadingRows((prev) => prev.filter((id) => id !== gigId));
    },
    [deleteGig],
  );

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "rowNumber",
        headerName: "#",
        width: 60,
        sortable: false,
        renderCell: (params) => {
          const index = rows.findIndex((row) => row.id === params.row.id);
          return (
            <div className="flex h-full items-center">
              {index + 1 + paginationModel.page * paginationModel.pageSize}
            </div>
          );
        },
      },
      {
        field: "gigInfo",
        headerName: "Gig",
        flex: 1,
        sortable: false,
        renderCell: (params) => {
          const { row } = params;
          const { title, thumbnail } = row;
          return (
            <Stack
              direction="row"
              alignItems="center"
              sx={{ height: "100%" }}
              spacing={2}
            >
              <div className="relative h-14 w-14 flex-shrink-0">
                <Image
                  src={thumbnail.url}
                  alt="Gig Thumbnail"
                  fill
                  className="rounded-sm"
                />
              </div>

              <Typography variant="body1">{title}</Typography>
            </Stack>
          );
        },
      },
      {
        field: "views",
        headerName: "Views",
        type: "number",
        width: 110,
        renderCell: ({ row }) => (
          <div className="flex h-full items-center justify-end">
            {row.views}
          </div>
        ),
      },
      {
        field: "orders",
        headerName: "Orders",
        type: "number",
        width: 110,
        renderCell: ({ row }) => (
          <div className="flex h-full items-center justify-end">
            {row.orderCount}
          </div>
        ),
      },
      {
        field: "cancellations",
        headerName: "Cancellations",
        type: "number",
        width: 110,
        renderCell: ({ row }) => {
          const percent = (row.orderCount * 100) / row.views;

          return (
            <div className="flex h-full items-center justify-end">
              {row.cancellations != null ? `${percent}%` : "0%"}
            </div>
          );
        },
      },
      {
        field: "actions",
        headerName: "Actions",
        width: 100,
        sortable: false,
        renderCell: (params) => {
          const { row } = params;
          const { slug } = row;
          const editUrl = `/gigs/edit/${slug}`;
          const reviewUrl = `/gig/${slug}`;
          return (
            <div className="my-2 flex flex-col space-y-2">
              <Button
                href={editUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="contained"
                color="primary"
                size="small"
                disabled={loadingRows.includes(row.id)}
              >
                Edit
              </Button>

              <Button
                href={reviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="contained"
                color="success"
                size="small"
                disabled={loadingRows.includes(row.id)}
              >
                Review
              </Button>

              {gigStatus === GigStatus.ACTIVE && (
                <Button
                  variant="contained"
                  color="warning"
                  size="small"
                  onClick={() => handlePauseRow(row)}
                  disabled={loadingRows.includes(row.id)}
                >
                  Paused
                </Button>
              )}

              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={() => handleDeleteRow(row.id)}
                disabled={loadingRows.includes(row.id)}
              >
                {loadingRows.includes(row.id) ? "Deleting" : "Delete"}
              </Button>
            </div>
          );
        },
      },
    ],
    [handleDeleteRow, loadingRows],
  );

  const [rowCount, setRowCount] = useState(50);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const response = await axiosInstanceV1.get(`/gig`, {
          params: {
            page: paginationModel.page + 1,
            limit: paginationModel.pageSize,
            filters: `status:${gigStatus},` + `day_range:${dayRange}`,
          },
        });

        debugger;

        const { data, meta } = response.data;
        setRows(data);
        setRowCount(meta.itemCount);
      } catch (error) {
        alert("Error fetching data:" + error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [paginationModel, dayRange]);

  return (
    <Paper
      variant="elevation"
      elevation={0}
      sx={{ height: "80vh", width: "100%" }}
    >
      <Stack direction="row" alignItems="center" sx={{ padding: "10px 0" }}>
        <strong className="uppercase">{gigStatus.table_label}</strong>

        <div className="ml-auto flex items-center">
          {selectedRows.length > 0 && (
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteAll}
              disabled={isDeleting}
            >
              {isDeleting
                ? "Deleting..."
                : `Delete All (${selectedRows.length})`}
            </Button>
          )}

          <FormControl size="small" sx={{ m: 1, minWidth: 150 }}>
            <InputLabel id="time-range-label">Day Range</InputLabel>
            <Select
              labelId="time-range-label"
              id="time-range"
              value={dayRange}
              onChange={(e) => setDayRange(e.target.value as number)}
              label="Time Range"
            >
              <MenuItem value={7}>Last 7 Days</MenuItem>
              <MenuItem value={14}>Last 14 Days</MenuItem>
              <MenuItem value={30}>Last 30 Days</MenuItem>
              <MenuItem value={60}>Last 2 Months</MenuItem>
              <MenuItem value={90}>Last 3 Months</MenuItem>
              <MenuItem value="All">All</MenuItem>
            </Select>
          </FormControl>
        </div>
      </Stack>

      <DataGrid
        loading={loading}
        rows={rows}
        columns={columns}
        rowCount={rowCount}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[10, 20, 30, 40, 50]}
        checkboxSelection
        paginationMode="server"
        onRowSelectionModelChange={(ids) => {
          setSelectedRows(ids as string[]);
        }}
        getRowHeight={() => "auto"}
        disableRowSelectionOnClick
        slots={{ pagination: CustomPagination as any }}
        sx={{
          "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
            outline: "none !important",
          },
          "& .Mui-selected": {
            border: "none !important",
          },
          "& .MuiDataGrid-footerContainer": {
            minHeight: "70px",
          },
          "& .MuiTablePagination-select": {
            margin: "0 2px",
          },
        }}
      />
    </Paper>
  );
};

export default GigsManageTable;
