"use client";

import { CircularProgress, Divider, Tooltip } from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useCallback, useEffect, useState } from "react";
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

const tabs = [
  { label: "1. Overview", endpoint: "/api/overview" },
  {
    label: "2. Pricing",
    endpoint: "/api/pricing",
  },
  {
    label: "3. Description & FAQ",
    endpoint: "/api/description_fAQ",
  },
  { label: "4. Gallery", endpoint: "/api/denied" },
  { label: "5.Publish", endpoint: "/api/paused" },
];

const fetcher = (url: string) => {
  new Promise<string>((resolve) =>
    setTimeout(() => resolve(`Dữ liệu từ API: ${url}`), 1000),
  );
  //   const res = await fetch(url);
  //   if (!res.ok) {
  //     throw new Error("Lỗi khi tải dữ liệu");
  //   }
  //   return res.json();
};

export const gig_imagesUpload = [`image1`, `image2`, `image3`];
export const gig_videoUpload = [`video1`];
export const gig_documentsUpload = [`document1`, `document2`];

export const uploadGig = async (
  gig: GigDto | null | undefined = null,
  gigStatus: GigStatus,
): Promise<AxiosResponse<any>> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  let prevGig = gig;

  if (!gig) {
    const gigData = localStorage.getItem("gig");

    if (!gigData) {
      throw new Error("No gig data");
    }

    prevGig = JSON.parse(gigData);
  }

  const postGig = { ...prevGig, status: gigStatus };

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

interface Props {
  isEditGig?: boolean;
}

export default function GigAddEdit({ isEditGig = false }: Props) {
  const router = useRouter();

  const { data: session, status } = useSession();

  const [showSaveAndReview, setShowSaveAndReview] = useState(isEditGig);

  const [showSaveAsDraft, setShowSaveAsDraft] = useState(false);

  const [tab, setTab] = useState<string>(tabs[0].label);

  const [uploading, setUploading] = useState(false);

  const [gig, setGig] = useState<GigDto | null>(
    isEditGig ? null : new GigDto({}),
  );

  const { data, error, isValidating, isLoading } = useSWR(
    tabs.find((_) => _.label === tab)?.endpoint || null,

    fetcher,
    {
      revalidateOnFocus: true, // Fetch lại khi quay lại tab
      revalidateOnReconnect: true, // Fetch lại khi có kết nối mạng
      dedupingInterval: 0, // Luôn fetch khi chuyển tab
    },
  );

  const handleChangeTab = (_event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };

  // useEffect(() => {
  //   if (!isEditGig) setGig(new GigDto({}));
  // }, []);

  useEffect(() => {
    localStorage.setItem("gig", JSON.stringify(gig));
  }, [gig]);

  useEffect(() => {
    if (status === "authenticated" && session?.user.id) {
      setGig((prev) =>
        prev ? { ...prev, seller: { id: session.user.id } } : prev,
      );
    }
  }, [status, session]);

  return (
    <div className="h-full min-h-screen">
      <Box
        sx={{
          borderColor: "transparent",
          fontSize: "14px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Tabs
          value={tab}
          onChange={handleChangeTab}
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
                />
              );
            }
          })}
        </Tabs>

        <div className="flex space-x-2">
          {showSaveAsDraft && (
            <Tooltip title="Save gig as draft status and back to gig managament page.">
              <button
                className="flex items-center rounded bg-green-500 px-2 font-bold text-white hover:bg-green-600"
                onClick={async () => {
                  setUploading(true);

                  try {
                    const response = await uploadGig(gig, GigStatus.DRAFT);

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
          )}

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
                    const response = await uploadGig(gig, GigStatus.DRAFT);

                    const { data, status } = response;

                    if (status === 201) {
                      const { slug } = data;

                      window.open(
                        `http://localhost:3001/gig/${slug}`,
                        "_blank",
                        "noopener,noreferrer",
                      );

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

      <Divider className="relative py-1" />

      <div className="relative h-full w-full">
        {isLoading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20">
            <CircularProgress />
          </div>
        )}

        {tab === tabs[0].label && (
          <AddGigOverview
            switchToTab={setTab}
            tabs={tabs}
            gig={gig}
            setGig={setGig}
          />
        )}

        {tab === tabs[1].label && (
          <GigPricing
            switchToTab={setTab}
            tabs={tabs}
            gig={gig}
            setGig={setGig}
          />
        )}

        {tab === tabs[2].label && (
          <GigDescriptionFaq
            switchToTab={setTab}
            tabs={tabs}
            gig={gig}
            setGig={setGig}
          />
        )}

        {tab === tabs[3].label && (
          <GigGallary
            switchToTab={setTab}
            tabs={tabs}
            gig={gig}
            setGig={setGig}
          />
        )}

        {tab === tabs[4].label && !isEditGig && (
          <GigPublish
            switchToTab={setTab}
            tabs={tabs}
            hanleOnSaveCb={uploadGig}
            gig={gig}
            setGig={setGig}
          />
        )}
      </div>
    </div>
  );
}
