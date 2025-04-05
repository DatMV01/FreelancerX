import { Button, CircularProgress, Divider } from "@mui/material";
import { useRef, useState } from "react";
import UploadFile from "./upload_file";
 

export const gig_imagesUpload = [`image1`, `image2`, `image3`];
export const gig_videoUpload = [`video1`];
export const gig_documentsUpload = [`document1`, `document2`];

interface Props {
  switchToTab: (tab: string) => void;
  tabs: { label: string }[];
  gig: any;
  setGig: any;
}

const GigGallary = ({ switchToTab, tabs, gig, setGig }: Props) => {
  const uploadRefs = {
    image1: useRef<any>(null),
    image2: useRef<any>(null),
    image3: useRef<any>(null),
    video: useRef<any>(null),
    document1: useRef<any>(null),
    document2: useRef<any>(null),
  };

  const handleAllUploads = () => {
    Object.values(uploadRefs).forEach((ref) => {
      if (ref.current) ref.current.handleUpload();
    });
  };

  const [uploading, setUploading] = useState(false);

  return (
    <div className="relative my-6 flex w-full flex-col space-y-10">
      {uploading && (
        <div className="bg-opacity-50 absolute inset-0 z-50 m-0 flex items-center justify-center bg-black">
          <CircularProgress />
        </div>
      )}

      <div>
        <strong className="text-2xl"> Images (up to 3)</strong>
        <p>
          Get noticed by the right buyers with visual examples of your services.
        </p>

        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          <UploadFile
            ref={uploadRefs.image1}
            keyFile={gig_imagesUpload[0]}
            fileType="image"
            updateGigCb={setGig}
            autoUpload
            fileInfomation={gig?.images?.image1}
          />
          <UploadFile
            ref={uploadRefs.image2}
            keyFile={gig_imagesUpload[1]}
            fileType="image"
            updateGigCb={setGig}
            autoUpload
            fileInfomation={gig?.images?.image2}
          />
          <UploadFile
            ref={uploadRefs.image3}
            keyFile={gig_imagesUpload[2]}
            autoUpload
            updateGigCb={setGig}
            fileType="image"
            fileInfomation={gig?.images?.image3}
          />
        </div>
      </div>
      <Divider />

      <div>
        <strong className="text-2xl"> Video (one only)</strong>
        <p>
          Capture buyers' attention with a video that showcases your service.
        </p>
        <p className="text-sm">
          Please choose a video shorter than 75 seconds and smaller than 50MB
        </p>

        <UploadFile
          ref={uploadRefs.video}
          keyFile={gig_videoUpload[0]}
          fileType="video"
          updateGigCb={setGig}
          className="h-[400px] w-full"
          autoUpload
          fileInfomation={gig?.video}
        />
      </div>
      <Divider />

      <div className="w-full">
        <strong className="text-2xl"> Documents (up to 2)</strong>
        <p>Show some of the best work you created in a document (PDFs only) </p>

        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          <UploadFile
            ref={uploadRefs.document1}
            keyFile={gig_documentsUpload[0]}
            fileType="document"
            className="h-[400px] w-full"
            updateGigCb={setGig}
            autoUpload
            fileInfomation={gig?.documents?.document1}
          />
          <UploadFile
            ref={uploadRefs.document2}
            keyFile={gig_documentsUpload[1]}
            fileType="document"
            className="h-[400px] w-full"
            updateGigCb={setGig}
            autoUpload
            fileInfomation={gig?.documents?.document2}
          />
        </div>
      </div>

      {/* <button
        onClick={handleAllUploads}
        className="mt-4 w-full bg-green-500 p-3 text-white"
      >
        Upload All Files
      </button> */}

      <Button
        variant="contained"
        sx={{ alignSelf: "end" }}
        onClick={async () => {
          // setUploading(true);
          // const isUploadOk = await hanleOnSaveAndCountinue();
          // setUploading(false);
          // isUploadOk &&
          switchToTab(tabs[4].label);
        }}
      >
        Continue
      </Button>
    </div>
  );
};

export default GigGallary;
