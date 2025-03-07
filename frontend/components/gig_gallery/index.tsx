import React, { useRef } from "react";
import UploadFile from "./upload_file";
import { Divider } from "@mui/material";

const GigGallary = () => {
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

  return (
    <div className="my-6 flex w-full flex-col space-y-10">
      <div>
        <strong className="text-2xl"> Images (up to 3)</strong>
        <p>
          Get noticed by the right buyers with visual examples of your services.
        </p>

        <div className="flex space-x-2">
          <UploadFile
            ref={uploadRefs.image1}
            localStorageKey="1"
            fileType="image"
            autoUpload
             
          />
          <UploadFile
            ref={uploadRefs.image2}
            localStorageKey="2"
            fileType="image"
            autoUpload
          />
          <UploadFile
            ref={uploadRefs.image3}
            localStorageKey="3"
            autoUpload
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
          localStorageKey="4"
          fileType="video"
          className="h-[400px] w-full"
          autoUpload
        />
      </div>
      <Divider />

      <div>
        <strong className="text-2xl"> Documents (up to 2)</strong>
        <p>Show some of the best work you created in a document (PDFs only) </p>

        <div className="flex space-x-2">
          <UploadFile
            ref={uploadRefs.document1}
            localStorageKey="5"
            fileType="document"
            className="h-[400px] w-[500px]"
            autoUpload
          />
          <UploadFile
            ref={uploadRefs.document2}
            localStorageKey="6"
            fileType="document"
            className="h-[400px] w-[500px]"
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
    </div>
  );
};

export default GigGallary;
