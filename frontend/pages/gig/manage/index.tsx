"use client";
import { GigStatus } from "@/dto/dto.type.";
import GigsManageTable from "@/features/gig/components/GigsManageTable";
import { Divider } from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface TabPanelProps {
  children?: React.ReactNode;
  value: string;
  index: string;
}

function CustomTabPanel({ children, value, index, ...other }: TabPanelProps) {
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
          {children}
        </Box>
      )}
    </div>
  );
}

export const gigStatusTabs = [
  {
    label: "ACTIVE",
    status: GigStatus.ACTIVE,
    table_label: "Active Gigs",
    fe_endpoint: `/gig/manage?tab=${GigStatus.ACTIVE.toLocaleLowerCase()}`,
  },

  {
    label: "DRAFT",
    status: GigStatus.DRAFT,
    table_label: "Draft Gigs",
    fe_endpoint: `/gig/manage?tab=${GigStatus.DRAFT.toLocaleLowerCase()}`,
  },
  {
    label: "PAUSED",
    status: GigStatus.PAUSED,
    table_label: "Paused Gigs",
    fe_endpoint: `/gig/manage?tab=${GigStatus.PAUSED.toLocaleLowerCase()}`,
  },
  {
    label: "PENDING APPROVAL",
    status: GigStatus.PENDING,
    table_label: "Gigs pending approval",
    fe_endpoint: `/gig/manage?tab=${GigStatus.PENDING.toLocaleLowerCase()}`,
  },
  {
    label: "REQUIRE MODIFICATION",
    status: GigStatus.MODIFICATION,
    table_label: "Gigs that require modifications",
    fe_endpoint: `/gig/manage?tab=${GigStatus.MODIFICATION.toLocaleLowerCase()}`,
  },

  {
    label: "REJECTED",
    status: GigStatus.REJECTED,
    table_label: "Rejected Gigs",
    fe_endpoint: `/gig/manage?tab=${GigStatus.REJECTED.toLocaleLowerCase()}`,
  },
];

export default function GìgsManage() {
  const [currentTab, setCurrentTab] = useState(gigStatusTabs[0].status);
  const searchParams = useSearchParams();
  const router = useRouter();

  const tabStatus = searchParams.get("tab") || gigStatusTabs[0].status;

  useEffect(() => {
    const tab =
      gigStatusTabs.find((_) =>
        _.fe_endpoint.endsWith(tabStatus.toLocaleLowerCase()),
      ) || gigStatusTabs[0];

    setCurrentTab(tab.status);
  }, [tabStatus]);

  const handleChange = (event: React.SyntheticEvent, newTab: string) => {
    router.push(`/gig/manage?tab=${newTab.toLocaleLowerCase()}`);
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
          {gigStatusTabs.map((tab) => {
            return (
              <Tab
                key={tab.label}
                label={tab.label}
                value={tab.status}
                sx={{ fontSize: "14px", cursor: "pointer" }}
                id={`simple-tab-${tab.label}`}
                aria-controls={`simple-tabpanel-${tab.label}`}
              />
            );
          })}
        </Tabs>

        <Link
          className="flex items-center rounded bg-green-500 px-2 font-bold text-white hover:bg-green-600"
          href="/gig/new"
          target="_blank"
          rel="noopener noreferrer"
        >
          CREATE A NEW GIG
        </Link>
      </Box>

      {gigStatusTabs.map((_) => (
        <CustomTabPanel key={_.label} index={_.status} value={currentTab}>
          <GigsManageTable gigStatus={currentTab} />
        </CustomTabPanel>
      ))}
    </div>
  );
}
