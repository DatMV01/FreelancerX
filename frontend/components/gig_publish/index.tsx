import Image from "next/image";
import Link from "next/link";
import Tooltip from "@mui/material/Tooltip";
import { useRouter } from "next/router";
export default function GigPublish() {
  const router = useRouter();

  return (
    <div className="w-full">
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
              onClick={() => {
                alert("Save & Preview");
                router.push("/gigs/manage?tab=paused");
              }}
            >
              Save & Preview
            </button>
          </Tooltip>

          <Tooltip title="Save gig as actice status and open review gig pagge">
            <button
              className="flex items-center rounded bg-blue-500 p-2 px-2 font-bold text-white hover:bg-blue-600"
              onClick={() => {
                alert("Save & Active");
                router.push("/gigs/manage?tab=active");
              }}
            >
              Save & Active
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
