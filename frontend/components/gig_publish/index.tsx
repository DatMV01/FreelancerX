import Image from "next/image";
import Link from "next/link";
import Tooltip from "@mui/material/Tooltip";
import { useRouter } from "next/router";
import { GigStatus } from "@/dto/dto.type.";
import { CircularProgress } from "@mui/material";
import { useState } from "react";
import { set } from "react-hook-form";

interface Props {
  switchToTab: (tab: string) => void;
  tabs: { label: string }[];
  hanleOnSaveCb: any;
  gig: any;
  setGig: any;
}

export default function GigPublish({
  switchToTab,
  tabs,
  hanleOnSaveCb,
  gig,
}: Props) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);

  const onSave = async (gigStatus: GigStatus, urlRedirect: string) => {
    setUploading(true);

    try {
      const response = await hanleOnSaveCb(gig, gigStatus);

      const { data, status } = response;

      if (status === 201) {
        const { slug } = data;

        window.open(
          `http://localhost:3001/gig/${slug}`,
          "_blank",
          "noopener,noreferrer",
        );

        setTimeout(() => {
          router.push(urlRedirect);
        }, 1000);
      }
    } catch (error: any) {
      alert(error.message);
    }

    setUploading(false);
  };

  return (
    <div className="relative h-[100vh] min-h-[100vh] w-full">
      {uploading && (
        <div className="absolute inset-0 z-50 m-0 flex items-center justify-center bg-black bg-opacity-50">
          <CircularProgress />
        </div>
      )}

      <div className="flex h-full flex-col items-center justify-center space-y-2">
        <Image src="/gig_publish.svg" alt="" width={500} height={500} />

        <p className="text-xl font-semibold">You're almost there!</p>
        <p className="mt-2 text-gray-600">
          Let's publish your Gig and get you ready to start selling.
        </p>
        <div className="flex space-x-2">
          <Tooltip title="Save gig as paused status and open review gig pagge">
            <button
              className="flex items-center rounded bg-green-500 p-2 px-2 font-bold text-white hover:bg-green-600"
              onClick={async () => {
                await onSave(
                  GigStatus.DRAFT,
                  "/gigs/manage?tab=" + GigStatus.DRAFT,
                );
              }}
            >
              Save as Draft & Preview
            </button>
          </Tooltip>

          <Tooltip title="Save gig as actice status and open review gig pagge">
            <button
              className="flex items-center rounded bg-orange-500 p-2 px-2 font-bold text-white hover:bg-orange-600"
              onClick={async () => {
                await onSave(
                  GigStatus.ACTIVE,
                  "/gigs/manage?tab=" + GigStatus.ACTIVE,
                );
              }}
            >
              Save as Active & Preview
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
