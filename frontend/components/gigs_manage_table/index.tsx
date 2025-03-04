import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import axios from "axios";
import Image from "next/image";

const GigsManageTable = ({
  data,
  gigStatus,
  ...props
}: {
  data: any;
  gigStatus: any;
}) => {
  const [rows, setRows] = React.useState(data);

  const [selectedRows, setSelectedRows] = React.useState<number[]>([]);
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 10,
  });
  const [timeRange, setTimeRange] = React.useState(7);
  const [loading, setLoading] = React.useState(false);
  const [loadingRows, setLoadingRows] = React.useState<number[]>([]);

  const deleteGigsAPI = async (gigIds: number[]) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return true;
    } catch (error) {
      console.error("Error deleting gigs:", error);
      return false;
    }
  };

  const handleDeleteAll = React.useCallback(async () => {
    if (selectedRows.length === 0) return;

    setLoading(true);
    const success = await deleteGigsAPI(selectedRows);

    if (success) {
      setRows((prevRows) =>
        prevRows.filter((row) => !selectedRows.includes(row.id)),
      );
      setSelectedRows([]);
    }
    setLoading(false);
  }, [selectedRows, deleteGigsAPI]);

  const deleteGigAPI = async (gigId: number) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      // await axios.delete(/api/gigs/${gigId});

      return true;
    } catch (error) {
      console.error(`Error deleting gig ${gigId}:`, error);
      return false;
    }
  };

  const handleDeleteRow = React.useCallback(
    async (gigId: number) => {
      setLoadingRows((prev) => [...prev, gigId]);

      const success = await deleteGigAPI(gigId);
      if (success) {
        setRows((prevRows) => prevRows.filter((row) => row.id !== gigId));
      }

      setLoadingRows((prev) => prev.filter((id) => id !== gigId));
    },
    [deleteGigAPI],
  );

  const columns: GridColDef[] = React.useMemo(
    () => [
      {
        field: "gigInfo",
        headerName: "Gig",
        flex: 1,
        sortable: false,
        renderCell: (params) => {
          const { title, image } = params.value as {
            title: string;
            image: string;
          };
          return (
            <Stack
              direction="row"
              alignItems="center"
              sx={{ height: "100%" }}
              spacing={2}
            >
              <div className="relative h-14 w-14 flex-shrink-0">
                <Image
                  src={image}
                  alt="Gig Thumbnail"
                  layout="fill"
                  className="rounded-sm"
                />
              </div>

              <Typography variant="body1">{title}</Typography>
            </Stack>
          );
        },
      },
      { field: "clicks", headerName: "Clicks", type: "number", width: 100 },
      { field: "orders", headerName: "Orders", type: "number", width: 100 },
      {
        field: "cancellations",
        headerName: "Cancellations (%)",
        type: "number",
        width: 150,
        valueFormatter: (value) => (value != null ? `${value}%` : "N/A"),
      },
      {
        field: "actions",
        headerName: "Actions",
        width: 120,
        sortable: false,
        renderCell: ({ row }) => (
          <Stack spacing={1} sx={{ height: "100%", justifyContent: "center" }}>
            <Button variant="contained" color="primary" size="small">
              Edit
            </Button>
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={() => handleDeleteRow(row.id)}
              disabled={loadingRows.includes(row.id)}
            >
              {loadingRows.includes(row.id) ? "Deleting..." : "Delete"}
            </Button>
          </Stack>
        ),
      },
    ],
    [handleDeleteRow, loadingRows],
  );

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
              disabled={loading}
            >
              {loading ? "Deleting..." : `Delete All (${selectedRows.length})`}
            </Button>
          )}

          <FormControl size="small" sx={{ m: 1, minWidth: 150 }}>
            <InputLabel id="time-range-label">Time Range</InputLabel>
            <Select
              labelId="time-range-label"
              id="time-range"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as number)}
              label="Time Range"
            >
              <MenuItem value={7}>Last 7 Days</MenuItem>
              <MenuItem value={14}>Last 14 Days</MenuItem>
              <MenuItem value={30}>Last 30 Days</MenuItem>
              <MenuItem value={60}>Last 2 Months</MenuItem>
              <MenuItem value={90}>Last 3 Months</MenuItem>
            </Select>
          </FormControl>
        </div>
      </Stack>

      <DataGrid
        rows={rows}
        columns={columns}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[10, 20, 30, 40, 50]}
        checkboxSelection
        onRowSelectionModelChange={(ids) => setSelectedRows(ids as number[])}
        rowHeight={80}
        disableRowSelectionOnClick
        sx={{
          "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
            outline: "none !important",
          },
          "& .Mui-selected": {
            border: "none !important",
          },
        }}
      />
    </Paper>
  );
};

export default GigsManageTable;
