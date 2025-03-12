"use client";

import { CircularProgress, Divider, Tooltip } from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useEffect, useState } from "react";
import useSWR from "swr";
import AddGigOverview from "@/components/gig_add_overview";
import GigPricing from "@/components/gig_pricing";
import GigDescriptionFaq from "@/components/gig_description_faq";
import GigGallary from "@/components/gig_gallery";
import GigPublish from "@/components/gig_publish";
import { useRouter } from "next/navigation";
import { GigDto, GigStatus } from "@/dto/gig.dto";
import { useSession } from "next-auth/react";
import axiosInstance from "@/lib/apiClient";
import { AxiosResponse } from "axios";

const fetcher = (url: string) =>
  new Promise<string>((resolve) =>
    setTimeout(() => resolve(`Dữ liệu từ API: ${url}`), 10),
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
        <div className="relative flex min-h-[80vh] justify-center">
          {loading ? (
            <div className="absolute inset-0 z-50 m-0 flex items-center justify-center bg-black bg-opacity-10">
              <CircularProgress />
            </div>
          ) : (
            children
          )}
        </div>
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

export const gig_imagesUpload = [`image1`, `image2`, `image3`];
export const gig_videoUpload = [`video1`];
export const gig_documentsUpload = [`document1`, `document2`];

interface Props {
  isEditGig?: boolean;
}
const openInNewTab = (url: string) => {
  window.open(url, "_blank", "noopener,noreferrer");
};
export default function GigAddEdit({ isEditGig = false }: Props) {
  const router = useRouter();

  const { data: session, status } = useSession();

  const [showSaveAndReview, setShowSaveAndReview] = useState(isEditGig);

  const [value, setValue] = useState<string>(tabs[0].label);

  const [uploading, setUploading] = useState(false);

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

  const [gig, setGig] = useState<GigDto | null>();

  useEffect(() => {
    if (isEditGig) {
      // Load data
    } else {
      setGig(new GigDto({}));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("gig", JSON.stringify(gig));
  }, [gig]);

  useEffect(() => {
    if (status === "authenticated") {
      setGig((prev: any) => ({ ...prev, seller: { id: session?.user.id } }));
    }
  }, [status]);

  const uploadGig = async (
    gigStatus: GigStatus,
  ): Promise<AxiosResponse<any>> => {
    if (!gig) {
      throw new Error("No gig data");
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const postGig: GigDto = { ...gig, status: gigStatus };

    debugger;

    const response: AxiosResponse<any> = await axiosInstance.post(
      "/gig",
      postGig,
    );

    if (response.status === 400) {
      alert("Upload failed");
    }

    localStorage.removeItem("gig");

    return response;
  };

  return (
    <div className="relative h-full min-h-screen">
      <Box
        sx={{
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
          {tabs.map((tab, index) => {
            if (isEditGig) {
              if (tab.label !== "5.Publish") {
                return (
                  <Tab
                    key={tab.label}
                    label={tab.label}
                    value={tab.label}
                    sx={{ fontSize: "14px" }}
                    {...a11yProps(tab.label)}
                  />
                );
              }
            } else {
              return (
                <Tab
                  key={tab.label}
                  label={tab.label}
                  value={tab.label}
                  sx={{ fontSize: "14px" }}
                  {...a11yProps(tab.label)}
                />
              );
            }
          })}
        </Tabs>

        {uploading && (
          <div className="absolute inset-0 z-50 m-0 flex items-center justify-center bg-black bg-opacity-50">
            <CircularProgress />
          </div>
        )}

        <div className="flex space-x-2">
          {/* <Tooltip title="Save gig as draft status and back to gig managament page.">
            <button
              className="flex items-center rounded bg-green-500 px-2 font-bold text-white hover:bg-green-600"
              onClick={async () => {
                setUploading(true);

                try {
                  const response = await uploadGig(GigStatus.DRAFT);

                  const { data, status } = response;

                  if (status === 201) {
                    router.push("/gigs/manage?tab=" + GigStatus.DRAFT);
                  }
                } catch (error: any) {
                  alert(error.message);
                }
                setUploading(false);
              }}
            >
              Save as Draft & <br /> Back to manage
            </button>
          </Tooltip> 
          
          */}

          <Tooltip title="Save gig as draft status and back to gig managament page.">
            <button
              className="flex items-center rounded bg-green-500 px-2 font-bold text-white hover:bg-green-600"
              onClick={async () => {
                router.push("/gigs/manage?tab=" + GigStatus.ACTIVE);
              }}
            >
              Back to manage
            </button>
          </Tooltip>

          {showSaveAndReview && (
            <Tooltip title="Save gig as paused status and open review gig pagge">
              <button
                className="flex items-center rounded bg-green-500 px-2 font-bold text-white hover:bg-green-600"
                onClick={async () => {
                  setUploading(true);

                  try {
                    const response = await uploadGig(GigStatus.DRAFT);

                    const { data, status } = response;

                    if (status === 201) {
                      const { slug } = data;
                      openInNewTab(`http://localhost:3001/gig/${slug}`);

                      router.push("/gigs/manage?tab=" + GigStatus.DRAFT);
                    }
                  } catch (error: any) {
                    alert(error.message);
                  }
                  setUploading(false);
                }}
              >
                Save & <br /> Preview
              </button>
            </Tooltip>
          )}
        </div>
      </Box>

      <Divider className="py-1" />

      <CustomTabPanel
        key={tabs[0].label}
        index={tabs[0].label}
        value={value}
        loading={isLoading}
      >
        {/* {error ? "Lỗi khi tải dữ liệu" : data || "Chưa có dữ liệu"} */}
        <AddGigOverview
          switchToTab={switchToTab}
          tabs={tabs}
          gig={gig}
          setGig={setGig}
        />
      </CustomTabPanel>

      <CustomTabPanel
        key={tabs[1].label}
        index={tabs[1].label}
        value={value}
        loading={isLoading}
      >
        {/* {error ? "Lỗi khi tải dữ liệu" : data || "Chưa có dữ liệu"} */}

        <GigPricing
          switchToTab={switchToTab}
          tabs={tabs}
          gig={gig}
          setGig={setGig}
        />
      </CustomTabPanel>

      <CustomTabPanel
        key={tabs[2].label}
        index={tabs[2].label}
        value={value}
        loading={isLoading}
      >
        {/* {error ? "Lỗi khi tải dữ liệu" : data || "Chưa có dữ liệu"} */}

        <GigDescriptionFaq
          switchToTab={switchToTab}
          tabs={tabs}
          gig={gig}
          setGig={setGig}
        />
      </CustomTabPanel>

      {/* <CustomTabPanel
        key={tabs[3].label}
        index={tabs[3].label}
        value={value}
        loading={isLoading}
      >
 
        {tabs[3].label}
      </CustomTabPanel> */}

      <CustomTabPanel
        key={tabs[3].label}
        index={tabs[3].label}
        value={value}
        loading={isLoading}
      >
        {/* {error ? "Lỗi khi tải dữ liệu" : data || "Chưa có dữ liệu"} */}

        <GigGallary
          switchToTab={switchToTab}
          tabs={tabs}
          gig={gig}
          setGig={setGig}
        />
      </CustomTabPanel>

      {!isEditGig && (
        <CustomTabPanel
          key={tabs[4].label}
          index={tabs[4].label}
          value={value}
          loading={isLoading}
        >
          {/* {error ? "Lỗi khi tải dữ liệu" : data || "Chưa có dữ liệu"} */}

          <GigPublish
            switchToTab={switchToTab}
            tabs={tabs}
            hanleOnSaveCb={uploadGig}
          />
        </CustomTabPanel>
      )}
    </div>
  );
}
