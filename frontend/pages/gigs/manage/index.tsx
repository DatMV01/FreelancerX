"use client";

import GigsManageTable from "@/components/gigs_manage_table";
import { GigStatus } from "@/dto/dto.type.";
import { axiosInstanceV1 } from "@/lib/axios/axiosInstance";
import { CircularProgress, Divider } from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const fetcher = async (url: string) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return (await axiosInstanceV1.get(url)).data;
};

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
    status: GigStatus.ACTIVE,
    table_label: "Active Gigs",
    fe_endpoint: `/gigs/manage?tab=${GigStatus.ACTIVE.toLocaleLowerCase()}`,
  },

  {
    label: "DRAFT",
    status: GigStatus.DRAFT,
    table_label: "Draft Gigs",
    fe_endpoint: `/gigs/manage?tab=${GigStatus.DRAFT.toLocaleLowerCase()}`,
  },
  {
    label: "PAUSED",
    status: GigStatus.PAUSED,
    table_label: "Paused Gigs",
    fe_endpoint: `/gigs/manage?tab=${GigStatus.PAUSED.toLocaleLowerCase()}`,
  },
  {
    label: "PENDING APPROVAL",
    status: GigStatus.PENDING,
    table_label: "Gigs pending approval",
    fe_endpoint: `/gigs/manage?tab=${GigStatus.PENDING.toLocaleLowerCase()}`,
  },
  {
    label: "REQUIRE MODIFICATION",
    status: GigStatus.MODIFICATION,
    table_label: "Gigs that require modifications",
    fe_endpoint: `/gigs/manage?tab=${GigStatus.MODIFICATION.toLocaleLowerCase()}`,
  },

  {
    label: "REJECTED",
    status: GigStatus.REJECTED,
    table_label: "Rejected Gigs",
    fe_endpoint: `/gigs/manage?tab=${GigStatus.REJECTED.toLocaleLowerCase()}`,
  },
];

// const fakeData = Array.from({ length: 50 }, (_, index) => ({
//   id: index + 1,
//   gigInfo: {
//     title: `Gig Title ${index + 1}`,
//     image: `https://i.pravatar.cc/100?img=${(index % 10) + index}`,
//   },
//   clicks: Math.floor(Math.random() * 500) + 1,
//   orders: Math.floor(Math.random() * 200) + 1,
//   cancellations: Math.floor(Math.random() * 50) + 1,
// }));

export default function ManageGig() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const tabStatus = searchParams.get("tab") || tabs[0].status;

  const [currentTab, setCurrentTab] = useState(tabs[0].status);

  useEffect(() => {
    const tab =
      tabs.find((_) => _.fe_endpoint.endsWith(tabStatus.toLocaleLowerCase())) ||
      tabs[0];

    setCurrentTab(tab.status);
  }, [tabStatus]);

  // const { data, error, isValidating, isLoading } = useSWR(beEndpoint, fetcher, {
  // //  revalidateOnFocus: true,
  //   revalidateOnReconnect: true,
  //   dedupingInterval: 60000,
  // });

  const isValidating = false;

  const data = null;

  const handleChange = (event: React.SyntheticEvent, newTab: string) => {
    console.log("newTab", newTab);

    router.push(`/gigs/manage?tab=${newTab.toLocaleLowerCase()}`);
  };

  console.log("currentTab", currentTab);
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
          {tabs.map((tab) => {
            return (
              <Tab
                key={tab.label}
                label={tab.label}
                value={tab.status}
                sx={{ fontSize: "14px" }}
                {...a11yProps(tab.label)}
              />
            );
          })}
        </Tabs>

        <Link
          className="flex items-center rounded bg-green-500 px-2 font-bold text-white hover:bg-green-600"
          href="/gigs/new"
          target="_blank"
          rel="noopener noreferrer"
        >
          CREATE A NEW GIGS
        </Link>

        
        <Link
          className="flex items-center rounded bg-green-500 px-2 font-bold text-white hover:bg-green-600"
          href="/gig/new"
          target="_blank"
          rel="noopener noreferrer"
        >
          CREATE A NEW GIG
        </Link>
      </Box>

      <Divider className="py-1" />

      <CustomTabPanel
        key={tabs[0].label}
        index={tabs[0].status}
        value={currentTab}
        loading={isValidating}
      >
        {/* {error ? "Lỗi khi tải dữ liệu" : data || "Chưa có dữ liệu"} */}
        <GigsManageTable data={data} gigStatus={currentTab} />
      </CustomTabPanel>

      <CustomTabPanel
        key={tabs[1].label}
        index={tabs[1].status}
        value={currentTab}
        loading={isValidating}
      >
        {/* {error ? "Lỗi khi tải dữ liệu" : data || "Chưa có dữ liệu"} */}
        <GigsManageTable data={data} gigStatus={currentTab} />
      </CustomTabPanel>

      <CustomTabPanel
        key={tabs[2].label}
        index={tabs[2].status}
        value={currentTab}
        loading={isValidating}
      >
        {/* {error ? "Lỗi khi tải dữ liệu" : data || "Chưa có dữ liệu"} */}
        <GigsManageTable data={data} gigStatus={currentTab} />
      </CustomTabPanel>

      <CustomTabPanel
        key={tabs[3].label}
        index={tabs[3].status}
        value={currentTab}
        loading={isValidating}
      >
        {/* {error ? "Lỗi khi tải dữ liệu" : data || "Chưa có dữ liệu"} */}

        <GigsManageTable data={null} gigStatus={currentTab} />
      </CustomTabPanel>

      <CustomTabPanel
        key={tabs[4].label}
        index={tabs[4].status}
        value={currentTab}
        loading={isValidating}
      >
        {/* {error ? "Lỗi khi tải dữ liệu" : data || "Chưa có dữ liệu"} */}
        <GigsManageTable data={null} gigStatus={currentTab} />
      </CustomTabPanel>

      <CustomTabPanel
        key={tabs[5].label}
        index={tabs[5].status}
        value={currentTab}
        loading={isValidating}
      >
        {/* {error ? "Lỗi khi tải dữ liệu" : data || "Chưa có dữ liệu"} */}
        <GigsManageTable data={null} gigStatus={currentTab} />
      </CustomTabPanel>
    </div>
  );
}
