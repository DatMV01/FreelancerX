import {
  CircularProgress,
  Divider
} from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import * as React from "react";
import useSWR from "swr";
import AddGigOverview from "@/components/gig_add_overview";
import GigPricing from "@/components/gig_pricing";
import GigDescriptionFaq from "@/components/gig_description_faq";
import GigGallary from "@/components/gig_gallery";
import GigPublish from "@/components/gig_publish";

const fetcher = (url: string) =>
  new Promise<string>((resolve) =>
    setTimeout(() => resolve(`Dữ liệu từ API: ${url}`), 100),
  );

// const fetcher = async (url: string) => {
//   const res = await fetch(url);
//   if (!res.ok) {
//     throw new Error("Lỗi khi tải dữ liệu");
//   }
//   return res.json();
// };

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

            minHeight: "80vh",
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
  { label: "1. Overview", table_label: "Overview", endpoint: "/api/overview" },
  {
    label: "2. Pricing",
    table_label: "Pricing",
    endpoint: "/api/pricing",
  },
  {
    label: "3. Description & FAQ",
    table_label: "Description & FAQ",
    endpoint: "/api/description_fAQ",
  },
  {
    label: "4. Requirements",
    table_label: "Requirements",
    endpoint: "/api/requirements",
  },
  { label: "5. Gallery", table_label: "Gallery", endpoint: "/api/denied" },
  { label: "6.Publish", table_label: "Paused Gigs", endpoint: "/api/paused" },
];

export default function CreateNewGig() {
  const [value, setValue] = React.useState<string>(tabs[0].label);

  const switchToTab = (label: string) => {
    setValue(label);
  };

  const { data, error, isValidating, isLoading } = useSWR(
    tabs.find((tab) => tab.label === value)?.endpoint || null,

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
    <div className="h-full min-h-screen">
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
          className="flex items-center rounded bg-green-500 px-2 font-bold text-white hover:bg-green-600"
          onClick={() => alert("Save")}
        >
          Save
        </button>

        <button
          className="flex items-center rounded bg-green-500 px-2 font-bold text-white hover:bg-green-600"
          onClick={() => alert("Save & Previews")}
        >
          Save & <br /> Previews
        </button>
      </Box>

      <Divider className="py-1" />

      <CustomTabPanel
        key={tabs[0].label}
        index={tabs[0].label}
        value={value}
        loading={isLoading}
      >
        {/* {error ? "Lỗi khi tải dữ liệu" : data || "Chưa có dữ liệu"} */}

        {error ? (
          "Lỗi khi tải dữ liệu"
        ) : (
          <AddGigOverview switchToTab={switchToTab} tabs={tabs} />
        )}
      </CustomTabPanel>

      <CustomTabPanel
        key={tabs[1].label}
        index={tabs[1].label}
        value={value}
        loading={isLoading}
      >
        {/* {error ? "Lỗi khi tải dữ liệu" : data || "Chưa có dữ liệu"} */}

        <GigPricing switchToTab={switchToTab} tabs={tabs} />
      </CustomTabPanel>

      <CustomTabPanel
        key={tabs[2].label}
        index={tabs[2].label}
        value={value}
        loading={isLoading}
      >
        {/* {error ? "Lỗi khi tải dữ liệu" : data || "Chưa có dữ liệu"} */}
        <GigDescriptionFaq switchToTab={switchToTab} tabs={tabs} />
      </CustomTabPanel>

      <CustomTabPanel
        key={tabs[3].label}
        index={tabs[3].label}
        value={value}
        loading={isLoading}
      >
        {/* {error ? "Lỗi khi tải dữ liệu" : data || "Chưa có dữ liệu"} */}
        {tabs[3].label}
      </CustomTabPanel>

      <CustomTabPanel
        key={tabs[4].label}
        index={tabs[4].label}
        value={value}
        loading={isLoading}
      >
        {/* {error ? "Lỗi khi tải dữ liệu" : data || "Chưa có dữ liệu"} */}

        <GigGallary />
      </CustomTabPanel>

      <CustomTabPanel
        key={tabs[5].label}
        index={tabs[5].label}
        value={value}
        loading={isLoading}
      >
        {/* {error ? "Lỗi khi tải dữ liệu" : data || "Chưa có dữ liệu"} */}
        <GigPublish />
      </CustomTabPanel>
    </div>
  );
}
