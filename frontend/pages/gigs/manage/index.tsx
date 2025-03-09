import GigsManageTable from "@/components/gigs_manage_table";
import { CircularProgress, Divider } from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";

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
  {
    label: "ACTIVE",
    table_label: "Active Gigs",
    fe_endpoint: "/gigs/manage?tab=active",
    be_endpoint: "/gig?status=active",
  },

  {
    label: "DRAFT",
    table_label: "Draft Gigs",
    fe_endpoint: "/gigs/manage?tab=draft",
    be_endpoint: "/gig?status=draft",
  },
  {
    label: "PAUSED",
    table_label: "Paused Gigs",
    fe_endpoint: "/gigs/manage?tab=paused",
    be_endpoint: "/gig?status=paused",
  },
  {
    label: "PENDING APPROVAL",
    table_label: "Gigs pending approval",
    fe_endpoint: "/gigs/manage?tab=pending",
    be_endpoint: "/gig?status=pending",
  },
  {
    label: "REQUIRES MODIFICATION",
    table_label: "Gigs that require modifications",
    fe_endpoint: "/gigs/manage?tab=modification",
    be_endpoint: "/gig?status=modification",
  },

  {
    label: "DENIED",
    table_label: "Denied Gigs",
    fe_endpoint: "/gigs/manage?tab=denied",
    be_endpoint: "/gig?status=denied",
  },
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
  const searchParams = useSearchParams();

  const [currentTab, setCurrentTab] = useState<string>(tabs[0].label);

  const tab = searchParams.get("tab");

  useEffect(() => {
    if (tab) {
      const isTabExisted = tabs.some((_) => _.fe_endpoint.endsWith(tab));
      isTabExisted && setCurrentTab(tab.toUpperCase());
    }
  }, [tab]);

  const { data, error, isValidating, isLoading } = useSWR(
    `/fake-api/${currentTab}`,
    fetcher,
    {
      revalidateOnFocus: true, // Fetch lại khi quay lại tab
      revalidateOnReconnect: true, // Fetch lại khi có kết nối mạng
      dedupingInterval: 0, // Luôn fetch khi chuyển tab
    },
  );

  const handleChange = (event: React.SyntheticEvent, newTab: string) => {
    setCurrentTab(newTab);
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
          value={currentTab}
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

        <Link
          className="flex items-center rounded bg-green-500 px-2 font-bold text-white hover:bg-green-600"
          href="/gigs/new"
          target="_blank"
          rel="noopener noreferrer"
        >
          CREATE A NEW GIG
        </Link>
      </Box>

      <Divider className="py-1" />

      <CustomTabPanel
        key={tabs[0].label}
        index={tabs[0].label}
        value={currentTab}
        loading={isValidating}
      >
        {/* {error ? "Lỗi khi tải dữ liệu" : data || "Chưa có dữ liệu"} */}
        <GigsManageTable data={fakeData} gigStatus={tab} />
      </CustomTabPanel>

      <CustomTabPanel
        key={tabs[1].label}
        index={tabs[1].label}
        value={currentTab}
        loading={isValidating}
      >
        {/* {error ? "Lỗi khi tải dữ liệu" : data || "Chưa có dữ liệu"} */}
        <GigsManageTable data={fakeData} gigStatus={tab} />
      </CustomTabPanel>

      <CustomTabPanel
        key={tabs[2].label}
        index={tabs[2].label}
        value={currentTab}
        loading={isValidating}
      >
        {/* {error ? "Lỗi khi tải dữ liệu" : data || "Chưa có dữ liệu"} */}
        <GigsManageTable data={fakeData} gigStatus={tab} />
      </CustomTabPanel>

      <CustomTabPanel
        key={tabs[3].label}
        index={tabs[3].label}
        value={currentTab}
        loading={isValidating}
      >
        {/* {error ? "Lỗi khi tải dữ liệu" : data || "Chưa có dữ liệu"} */}
        <GigsManageTable data={null} gigStatus={tab} />
      </CustomTabPanel>

      <CustomTabPanel
        key={tabs[4].label}
        index={tabs[4].label}
        value={currentTab}
        loading={isValidating}
      >
        {/* {error ? "Lỗi khi tải dữ liệu" : data || "Chưa có dữ liệu"} */}
        <GigsManageTable data={null} gigStatus={tab} />
      </CustomTabPanel>

      <CustomTabPanel
        key={tabs[5].label}
        index={tabs[5].label}
        value={currentTab}
        loading={isValidating}
      >
        {/* {error ? "Lỗi khi tải dữ liệu" : data || "Chưa có dữ liệu"} */}
        <GigsManageTable data={null} gigStatus={tab} />
      </CustomTabPanel>
    </div>
  );
}
