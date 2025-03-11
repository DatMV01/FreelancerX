import React, { useEffect, useRef, useState } from "react";
import UploadFile from "./upload_file";
import { Button, CircularProgress, Divider } from "@mui/material";
import axios from "axios";
import { GigDto } from "@/dto/gig.dto";

interface Props {
  switchToTab: (tab: string) => void;
  tabs: { label: string }[];
}

export const imagesUpload = ["image1", "image2", "image3"];
export const videoUpload = ["video1"];
export const documentsUpload = ["document1", "document2"];

const GigGallary = ({ switchToTab, tabs }: Props) => {
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

  const [gig, setGig] = useState<GigDto>(() => {
    const gigLocalStorage = localStorage.getItem("gig");
    return gigLocalStorage ? JSON.parse(gigLocalStorage) : new GigDto({});
  });

  useEffect(() => {
    localStorage.setItem("gig", JSON.stringify(gig));
  }, [gig]);

  const [uploading, setUploading] = useState(false);

  const uploadGig = async () => {
    const gigLocalStorage = localStorage.getItem("gig");
    if (!gigLocalStorage) return;

    setUploading(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/gig`,
        JSON.parse(gigLocalStorage),
      );

      console.log("Response:", response.data);

      // const data = await response.json();

      if (response.status === 200) {
        alert("Upload OK");
      }

      if (response.status === 400) {
        alert("Upload failed");
      }
    } catch (error) {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative my-6 flex w-full flex-col space-y-10">
      {uploading && (
        <div className="absolute inset-0 z-50 m-0 flex items-center justify-center bg-black bg-opacity-50">
          <CircularProgress />
        </div>
      )}

      <div>
        <strong className="text-2xl"> Images (up to 3)</strong>
        <p>
          Get noticed by the right buyers with visual examples of your services.
        </p>

        <div className="flex space-x-2">
          <UploadFile
            ref={uploadRefs.image1}
            localStorageKey={imagesUpload[0]}
            fileType="image"
            updateGigCb={setGig}
            autoUpload
          />
          <UploadFile
            ref={uploadRefs.image2}
            localStorageKey={imagesUpload[1]}
            fileType="image"
            updateGigCb={setGig}
            autoUpload
          />
          <UploadFile
            ref={uploadRefs.image3}
            localStorageKey={imagesUpload[2]}
            autoUpload
            updateGigCb={setGig}
            fileType="image"
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
          localStorageKey={videoUpload[0]}
          fileType="video"
          updateGigCb={setGig}
          className="h-[400px] w-full"
          autoUpload
        />
      </div>
      <Divider />

      <div className="w-full">
        <strong className="text-2xl"> Documents (up to 2)</strong>
        <p>Show some of the best work you created in a document (PDFs only) </p>

        <div className="flex space-x-2">
          <UploadFile
            ref={uploadRefs.document1}
            localStorageKey={documentsUpload[0]}
            fileType="document"
            className="h-[400px] w-full"
            updateGigCb={setGig}
            autoUpload
          />
          <UploadFile
            ref={uploadRefs.document2}
            localStorageKey={documentsUpload[1]}
            fileType="document"
            className="h-[400px] w-full"
            updateGigCb={setGig}
            autoUpload
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
          await uploadGig();
          switchToTab(tabs[4].label);
        }}
      >
        Save & Continue
      </Button>
    </div>
  );
};

export default GigGallary;
