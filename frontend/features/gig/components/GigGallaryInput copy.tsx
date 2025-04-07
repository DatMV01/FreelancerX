import UploadFile from "@/components/uploadfile/UploadFile";
import { Button, CircularProgress, Divider } from "@mui/material";
import { useEffect, useRef, useState } from "react";

interface Props {
  gallarys?: any;
  onSetGallaryCb?: any;
}

type MediaItem = {
  id: string;
  url: string;
  mimeType: string;
  provider: string;
};

type MediaData = {
  images: {
    [key: string]: MediaItem;
  };
  documents: {
    [key: string]: MediaItem | null;
  };
  video: MediaItem;
};

export const gig_imagesUpload = [`image1`, `image2`, `image3`];
export const gig_videoUpload = [`video1`];
export const gig_documentsUpload = [`document1`, `document2`];

const GigGallaryInput = ({ gallarys, onSetGallaryCb }: Props) => {
  const [gallary, setGalarry] = useState<MediaData>(gallarys || []);

  useEffect(() => {
    onSetGallaryCb && onSetGallaryCb(gallary);
  }, [gallary]);

  return (
    <div className="relative my-6 flex w-full flex-col space-y-10">
      <div>
        <strong className="text-2xl"> Images (up to 3)</strong>
        <p>
          Get noticed by the right buyers with visual examples of your services.
        </p>

        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          <UploadFile
            autoUpload
            fileType="image"
            fileInfomation={gallary?.images?.image1}
            onFileChangeCb={(data: any) => {
              console.log(data);
              setGalarry(
                (prev) =>
                  ({
                    ...prev,
                    images: {
                      ...prev?.images,
                      image1: data.file,
                    },
                  }) as any,
              );
            }}
            onUploadSuccessCb={(data: any) => {
              console.log(data);
              setGalarry(
                (prev) =>
                  ({
                    ...prev,
                    images: {
                      ...prev?.images,
                      image1: data.data,
                    },
                  }) as any,
              );
            }}
            onDeleteSuccessCb={(data: any) => {
              console.log(data);

              setGalarry(
                (prev) =>
                  ({
                    ...prev,
                    images: {
                      ...prev?.images,
                      image1: null,
                    },
                  }) as any,
              );
            }}
          />
          <UploadFile
            autoUpload
            fileType="image"
            fileInfomation={gallary?.images?.image2}
            onFileChangeCb={(data: any) => {
              setGalarry(
                (prev) =>
                  ({
                    ...prev,
                    images: {
                      ...prev?.images,
                      image2: data.file,
                    },
                  }) as any,
              );
            }}
            onUploadSuccessCb={(data: any) => {
              setGalarry(
                (prev) =>
                  ({
                    ...prev,
                    images: {
                      ...prev?.images,
                      image2: data.data,
                    },
                  }) as any,
              );
            }}
            onDeleteSuccessCb={(data: any) => {
              setGalarry(
                (prev) =>
                  ({
                    ...prev,
                    images: {
                      ...prev?.images,
                      image2: null,
                    },
                  }) as any,
              );
            }}
          />
          <UploadFile
            autoUpload
            fileType="image"
            fileInfomation={gallary?.images?.image3}
            onFileChangeCb={(data: any) => {
              setGalarry(
                (prev) =>
                  ({
                    ...prev,
                    images: {
                      ...prev?.images,
                      image3: data.file,
                    },
                  }) as any,
              );
            }}
            onUploadSuccessCb={(data: any) => {
              setGalarry(
                (prev) =>
                  ({
                    ...prev,
                    images: {
                      ...prev?.images,
                      image3: data.data,
                    },
                  }) as any,
              );
            }}
            onDeleteSuccessCb={(data: any) => {
              console.log(data);

              setGalarry(
                (prev) =>
                  ({
                    ...prev,
                    images: {
                      ...prev?.images,
                      image3: null,
                    },
                  }) as any,
              );
            }}
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
          autoUpload
          fileType="video"
          className="h-[400px] w-full"
          onFileChangeCb={(data: any) => {
            console.log(data);
          }}
          onUploadSuccessCb={(data: any) => {
            setGalarry(
              (prev) =>
                ({
                  ...prev,
                  video: data.data,
                }) as any,
            );
          }}
          onDeleteSuccessCb={(data: any) => {
            console.log(data);

            setGalarry(
              (prev) =>
                ({
                  ...prev,
                  video: null,
                }) as any,
            );
          }}
        />
      </div>
      <Divider />

      <div className="w-full">
        <strong className="text-2xl"> Documents (up to 2)</strong>
        <p>Show some of the best work you created in a document (PDFs only) </p>

        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          <UploadFile
            autoUpload
            fileType="document"
            className="h-[400px] w-full"
            onFileChangeCb={(data: any) => {
              console.log(data);
            }}
            onUploadSuccessCb={(data: any) => {
              setGalarry(
                (prev) =>
                  ({
                    ...prev,
                    documents: {
                      ...prev?.documents,
                      document1: data.data,
                    },
                  }) as any,
              );
            }}
            onDeleteSuccessCb={(data: any) => {
              console.log(data);

              setGalarry(
                (prev) =>
                  ({
                    ...prev,
                    documents: {
                      ...prev?.documents,
                      document1: null,
                    },
                  }) as any,
              );
            }}
          />

          <UploadFile
            autoUpload
            fileType="document"
            className="h-[400px] w-full"
            onFileChangeCb={(data: any) => {
              console.log(data);
            }}
            onUploadSuccessCb={(data: any) => {
              setGalarry(
                (prev) =>
                  ({
                    ...prev,
                    documents: {
                      ...prev?.documents,
                      document2: data.data,
                    },
                  }) as any,
              );
            }}
            onDeleteSuccessCb={(data: any) => {
              console.log(data);

              setGalarry(
                (prev) =>
                  ({
                    ...prev,
                    documents: {
                      ...prev?.documents,
                      document2: null,
                    },
                  }) as any,
              );
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default GigGallaryInput;
