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
import { set } from "react-hook-form";

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
  gigData?: GigDto;
}

export default function GigAddEdit({ gigData }: Props) {
  const router = useRouter();

  const { data: session, status } = useSession();

  const [showIfEdit, setShowIfEdit] = useState(false);

  const [tab, setTab] = useState<string>(tabs[0].label);

  const [uploading, setUploading] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [gig, setGig] = useState<GigDto | null>(
    gigData ? gigData : new GigDto({}),
  );

  const handleChangeTab = (_event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };

  useEffect(() => {
    if (gigData) setShowIfEdit(true);
  }, [gigData]);

  useEffect(() => {
    if (status === "authenticated" && session?.user.id) {
      setGig((prev) =>
        prev ? { ...prev, seller: { id: session.user.id } } : prev,
      );
    }
  }, [status, session]);

  return (
    <div className="relative h-full min-h-screen">
      {uploading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20">
          <CircularProgress />
        </div>
      )}

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
            // if (showIfEdit) {
            //   if (tab.label !== "5.Publish") {
            //     return (
            //       <Tab
            //         key={tab.label}
            //         label={tab.label}
            //         value={tab.label}
            //         sx={{ fontSize: "14px" }}
            //       />
            //     );
            //   }
            // } else {
            //   return (
            //     <Tab
            //       key={tab.label}
            //       label={tab.label}
            //       value={tab.label}
            //       sx={{ fontSize: "14px" }}
            //     />
            //   );
            // }

            return (
              <Tab
                key={tab.label}
                label={tab.label}
                value={tab.label}
                sx={{ fontSize: "14px" }}
              />
            );
          })}
        </Tabs>

        <div className="flex space-x-2">
          {showIfEdit && false && (
            <Tooltip title="Save gig">
              <button
                className="flex items-center rounded bg-green-500 px-2 font-bold text-white hover:bg-green-600"
                onClick={async () => {
                  setUploading(true);

                  try {
                    const response = await uploadGig(
                      gig,
                      gig?.status || GigStatus.DRAFT,
                    );

                    const { data, status } = response;

                    if (status === 201) {
                      // router.replace("/gigs/edit/" + data?.slug);
                      alert("Gig updated successfully");

                      window.history.replaceState(
                        {},
                        "",
                        ` /gigs/edit/${data?.slug}`,
                      );
                    }
                  } catch (error: any) {
                    alert(error.message);
                  }
                  setUploading(false);
                }}
              >
                Update
              </button>
            </Tooltip>
          )}

          {showIfEdit && false && (
            <Tooltip title="Save gig and open review gig pagge">
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

                      //   router.push("/gigs/manage?tab=" + GigStatus.DRAFT);
                    }
                  } catch (error: any) {
                    alert(error.message);
                  }
                  setUploading(false);
                }}
              >
                Update & <br /> Preview
              </button>
            </Tooltip>
          )}

          <Tooltip title="Save gig as and back to gig managament page.">
            <button
              className="flex items-center rounded bg-green-500 px-2 font-bold text-white hover:bg-green-600"
              onClick={async () => {
                router.push("/gigs/manage?tab=" + GigStatus.ACTIVE);
              }}
            >
              Back <br />
              to manage
            </button>
          </Tooltip>
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

        {tab === tabs[4].label && (
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
