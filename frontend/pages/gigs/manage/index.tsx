import * as React from "react";
import useSWR from "swr";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { Divider, CircularProgress } from "@mui/material";
import { ChevronDown } from "lucide-react";
import GigsManageTable from "@/components/gigs_manage_table";

const fetcher = (url: string) =>
  new Promise<string>((resolve) =>
    setTimeout(() => resolve(`Dữ liệu từ API: ${url}`), 1000),
  );

interface TabPanelProps {
  children?: React.ReactNode;
  value: string;
  index: string;
  loading: boolean;
}

function CustomTabPanel({
  children,
  value,
  index,
  loading,
  ...other
}: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
          }}
        >
          {loading ? <CircularProgress /> : children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(label: string) {
  return {
    id: `simple-tab-${label}`,
    "aria-controls": `simple-tabpanel-${label}`,
  };
}

const tabs = [
  { label: "ACTIVE", table_label: "Active Gigs", endpoint: "/api/active" },
  { label: "PENDING APPROVAL", table_label: "Gigs pending approval", endpoint: "/api/pending" },
  {
    label: "REQUIRES MODIFICATION",
    table_label: "Gigs that require modifications",
    endpoint: "/api/modification",
  },
  { label: "DRAFT", table_label: "Draft Gigs", endpoint: "/api/draft" },
  { label: "DENIED", table_label: "Denied Gigs", endpoint: "/api/denied" },
  { label: "PAUSED", table_label: "Paused Gigs", endpoint: "/api/paused" },
];

const fakeData = Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,
  gigInfo: {
    title: `Gig Title ${index + 1}`,
    image: `https://i.pravatar.cc/100?img=${(index % 10) + index}`,
  },
  clicks: Math.floor(Math.random() * 500) + 1,
  orders: Math.floor(Math.random() * 200) + 1,
  cancellations: Math.floor(Math.random() * 50) + 1,
}));

export default function ManageGig() {
  const [value, setValue] = React.useState<string>(tabs[0].label);

  const { data, error, isValidating, isLoading } = useSWR(
    `/fake-api/${value}`,
    fetcher,
    {
      revalidateOnFocus: true, // Fetch lại khi quay lại tab
      revalidateOnReconnect: true, // Fetch lại khi có kết nối mạng
      dedupingInterval: 0, // Luôn fetch khi chuyển tab
    },
  );

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <div className="min-h-screen">
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "transparent",
          fontSize: "14px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="gig management tabs"
          sx={{ width: "fit-content" }}
        >
          {tabs.map((tab) => (
            <Tab
              key={tab.label}
              label={tab.label}
              value={tab.label}
              sx={{ fontSize: "14px" }}
              {...a11yProps(tab.label)}
            />
          ))}
        </Tabs>

        <button
          className="inline-block rounded bg-green-500 px-2 font-bold text-white hover:bg-green-600"
          onClick={() => alert("Hello! I am an alert box!")}
        >
          CREATE A NEW GIG
        </button>
      </Box>

      <Divider className="py-1" />

      {tabs.map((tab) => (
        <CustomTabPanel
          key={tab.label}
          value={value}
          index={tab.label}
          loading={isLoading}
        >
          {/* {error ? "Lỗi khi tải dữ liệu" : data || "Chưa có dữ liệu"} */}
          <GigsManageTable data={fakeData} gigStatus={tab} />
        </CustomTabPanel>
      ))}
    </div>
  );
}
