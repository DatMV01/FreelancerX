"use client";

import { GigDto, GigStatus } from "@/dto/dto.type.";
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

  const [inputPage, setInputPage] = useState(page + 1);

  useEffect(() => {
    setInputPage(page + 1);
  }, [page]);

  const handlePageChange = () => {
    const targetPage = Math.max(1, Math.min(inputPage, pageCount));
    if (targetPage !== page + 1) {
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
          `Page ${page + 1} of ${pageCount}`
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

const GigsManageTable = ({ gigStatus, ...props }: { gigStatus: any }) => {
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
  const [rowCount, setRowCount] = useState(50);

  const handleDeleteAll = async () => {
    if (selectedRows.length === 0) return;

    setLoadingRows(selectedRows);
    setDeleting(true);

    const results = await Promise.all(selectedRows.map(deleteGig));
    const success = results.every((result) => result === true);

    if (success) {
      setRows((prevRows) =>
        prevRows.filter((row) => !selectedRows.includes(row.id)),
      );
      setSelectedRows([]);
    } else {
      alert("Failed to delete some gigs. Please try again.");
    }

    setDeleting(false);
  };

  const handleDeleteRow = async (gigId: string) => {
    setLoadingRows((prev) => [...prev, gigId]);
    const success = await deleteGig(gigId);
    if (success) {
      setRows((prevRows) => prevRows.filter((row) => row.id !== gigId));
    }
    setLoadingRows((prev) => prev.filter((id) => id !== gigId));
  };

  const deleteGig = async (gigId: string) => {
    try {
      const response = await axiosInstanceV1.delete(`gigs/${gigId}`);
      if (response.status === 200) {
        return true;
      }
      throw new Error(`Failed to delete gig with ID: ${gigId}`);
    } catch (error) {
      console.error(error);
      alert(`Error deleting gig ${gigId}: ${error}`);
      return false;
    }
  };

  const handlePauseRow = async (row: any) => {
    const gigId = row.id;
    setLoadingRows((prev) => [...prev, gigId]);
    debugger;
    const data = {
      id: row.id,
      status: GigStatus.PAUSED,
    } as any;

    console.log(data);

    try {
      const response = await axiosInstanceV1.patch(`gig/${gigId}`, data);
      if (response.status === 200) {
        setLoadingRows((prev) => prev.filter((id) => id !== gigId));
        setRows((prevRows) => prevRows.filter((row) => row.id !== gigId));

        return true;
      }
      throw new Error(`Failed to pausing gig with ID: ${gigId}`);
    } catch (error) {
      console.error(error);
      alert(`Error pausing gig ${gigId}: ${error}`);
      return false;
    }
  };

  // const fetchGigs = async () => {
  //   try {
  //     const response = await axiosInstanceV1.get(`/gig`, {
  //       params: {
  //         page: paginationModel.page + 1,
  //         limit: paginationModel.pageSize,
  //         filters: `status:${gigStatus},` + `day_range:${dayRange}`,
  //       },
  //     });
  //     const { data, meta } = response.data;
  //     setRows(data);
  //     setRowCount(meta.itemCount);
  //   } catch (error) {
  //     alert("Error fetching data:" + error);
  //   }
  // };

  // useEffect(() => {
  //   setLoading(true);
  //   fetchGigs().finally(() => setLoading(false));
  // }, [dayRange, paginationModel.page, paginationModel.pageSize]);

  const fetchGigs = useCallback(async () => {
    try {
      const response = await axiosInstanceV1.get("/gig", {
        params: {
          page: paginationModel.page + 1,
          limit: paginationModel.pageSize,
          filters: `status:${gigStatus},day_range:${dayRange}`,
        },
      });
      const { data, meta } = response.data;
      setRows(data);
      setRowCount(meta.itemCount);
    } catch (error) {
      alert("Error fetching gigs: " + error);
    }
  }, [paginationModel, gigStatus, dayRange]);

  useEffect(() => {
    setLoading(true);
    fetchGigs().finally(() => setLoading(false));
  }, [fetchGigs]);

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "rowNumber",
        headerName: "#",
        width: 60,
        sortable: true,
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
        field: "title",
        headerName: "Gig",
        flex: 1,
        sortable: true,
        type: "string",
        valueGetter: (params: any) => {
          const title = params?.row?.title;
          return title ?? null;
        },
        sortComparator: (v1, v2) => {
          if (!v1 || !v2) return 0; // Handle null values
          return v1.localeCompare(v2); // Sort strings alphabetically
        },
        renderCell: (params) => {
          const { row } = params;
          const { title, images } = row;
          const { image1, image2, image3 } = images;

          return (
            <Stack
              direction="row"
              alignItems="center"
              sx={{ height: "100%" }}
              spacing={2}
            >
              <div className="relative h-14 w-14 flex-shrink-0">
                <Image
                  src={image1.url || image2.url || image3.url}
                  alt="Gig Thumbnail"
                  fill
                  className="rounded-sm"
                />
              </div>

              <Typography>{title}</Typography>
            </Stack>
          );
        },
      },
      {
        field: "basicPrice",
        headerName: "Pricing",
        type: "number",
        width: 120,
        sortComparator: (v1, v2) => {
          if (v1 === null || v2 === null) return 0; // Handle null values
          return v1 - v2; // Sort numbers in ascending order
        },
        renderCell: ({ row }) => {
          const basicPackage = row.packages.find(
            (_: any) => _.type === "basic",
          );
          const standardPackage = row.packages.find(
            (_: any) => _.type === "standard",
          );
          const premiumPackage = row.packages.find(
            (_: any) => _.type === "premium",
          );

          return (
            <div className="flex h-full flex-col items-start justify-center">
              <p>Basic: {basicPackage.price}</p>
              <p>Standard:{standardPackage.price}</p>
              <p>Premiem:{premiumPackage.price}</p>
            </div>
          );
        },
      },
      {
        field: "ratingAverate",
        headerName: "Rating",
        type: "number",
        width: 100,
        sortComparator: (v1, v2) => {
          if (v1 === null || v2 === null) return 0; // Handle null values
          return v1 - v2; // Sort numbers in ascending order
        },
        renderCell: ({ row }) => (
          <div className="flex h-full flex-col items-start justify-center">
            <p>Count: {row.ratingCount}</p>
            <p>Average:{row.ratingAverate}</p>
          </div>
        ),
      },
      {
        field: "orders",
        headerName: "Orders",
        type: "number",
        width: 70,
        sortComparator: (v1, v2) => {
          if (v1 === null || v2 === null) return 0; // Handle null values
          return v1 - v2; // Sort numbers in ascending order
        },
        renderCell: ({ row }) => (
          <div className="flex h-full items-center justify-end">
            {row.orderCount}
          </div>
        ),
      },
      {
        field: "updatedAt",
        headerName: "DateTime",
        type: "dateTime",
        sortable: true,
        width: 110,
        valueGetter: (params: any) => {
          const updatedAt = params?.row?.updatedAt;
          return updatedAt ? new Date(updatedAt) : null;
        },
        sortComparator: (v1, v2) => {
          if (!v1 || !v2) return 0;
          return v1.getTime() - v2.getTime();
        },
        renderCell: (params) => {
          if (!params || !params.row || !params.row.updatedAt) {
            return (
              <div className="flex h-full items-center justify-end">N/A</div>
            );
          }

          const date = new Date(params.row.updatedAt);

          // Format the date
          const hh = String(date.getHours()).padStart(2, "0");
          const mm = String(date.getMinutes()).padStart(2, "0");
          const ss = String(date.getSeconds()).padStart(2, "0");
          const dd = String(date.getDate()).padStart(2, "0");
          const MM = String(date.getMonth() + 1).padStart(2, "0");
          const yyyy = date.getFullYear();

          const formatted = `${hh}:${mm}:${ss} ${dd}/${MM}/${yyyy}`;

          return (
            <div className="flex h-full items-center justify-end">
              {formatted}
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
          const editUrl = `/gig/edit/${slug}`;
          const reviewUrl = `/gig/${slug}`;
          return (
            <div className="m-y-2 flex flex-col justify-center">
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
                sx={{ marginTop: 1 }}
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
                  sx={{ marginTop: 1 }}
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
                sx={{ marginTop: 1 }}
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

  return (
    <Paper
      variant="elevation"
      elevation={0}
      sx={{ height: "100%", width: "100%" }}
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
        getRowHeight={(params: any) => {
          // return params?.row?.someField === "specialValue" ? 100 : 150;
          return "auto" as any;
        }}
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
