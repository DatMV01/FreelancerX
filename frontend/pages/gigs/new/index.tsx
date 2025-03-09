import { CircularProgress, Divider } from "@mui/material";
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
import GigAddEdit from "@/components/gig_add_edit";

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
  // {
  //   label: "4. Requirements2",
  //   table_label: "Requirements",
  //   endpoint: "/api/requirements",
  // },
  { label: "4. Gallery", table_label: "Gallery", endpoint: "/api/denied" },
  { label: "5.Publish", table_label: "Paused Gigs", endpoint: "/api/paused" },
];

interface Props {
  isEditGig?: boolean;
}

export default function CreateNewGig({ isEditGig = false }: Props) {
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

  return <GigAddEdit />;
}
