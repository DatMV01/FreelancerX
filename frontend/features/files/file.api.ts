import { axiosInstanceV1 } from "@/lib/axios/axiosInstance";
import axios from "axios";

/**
 * Uploads a file to the server with a clean file name.
 */
export async function uploadFile({
  file,
  newFileName,
  field = "file",
  uploadUrl = "/file/upload",
}: {
  file: File;
  field?: string;
  uploadUrl?: string;
  newFileName?: string;
}): Promise<{ success: boolean; data?: any; error?: string }> {
  const ext = file.name.split(".").pop() || "dat";

  try {
    let finalFile = file;
    if (newFileName) {
      finalFile = new File([file], `${newFileName}.${ext}`, {
        type: file.type,
      });
    }

    // Prepare FormData
    const formData = new FormData();
    formData.append(field, finalFile);

    // Make Axios request
    const response = await axiosInstanceV1.post(uploadUrl, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return { success: true, data: response.data };
  } catch (err: any) {
    return {
      success: false,
      error: err.response?.data?.message || err.message || "Upload failed",
    };
  }
}

export const deleteFileById = async (id: string): Promise<boolean> => {
  if (!id) return false;

  try {
    const response = await axiosInstanceV1.delete(`/file/${id}`);

    if (response.status === 200) {
      return true;
    }

    return false;
  } catch (error) {
     console.error(error)
    return false;
  }
};

export const deleteFileByUrl = async (url: string): Promise<boolean> => {
  if (!url) return false;

  if (url) {
    try {
      const response = await axiosInstanceV1.delete(`/file/name/${url}`);

      if (response.status === 200) {
        return true;
      }

      return false;
    } catch (error) {
      return false;
    }
  }

  return false;
};

// const handleUpload = async (): Promise<boolean> => {
//   if (!file) return false;
//   setUploading(true);

//   let newFile;
//   if (addionalFileType) {
//     const newFileName = `${addionalFileType}___${file.name}`;
//     newFile = new File([file], newFileName, { type: file.type });
//   }

//   const formData = new FormData();
//   formData.append("file", newFile || file);

//   try {
//     const { data, status } = await axiosInstanceV1.post(
//       "/file/upload",
//       formData,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       },
//     );

//     if (status === 201) {
//       const { id, url } = data;

//       setFileInfo(data);

//       onUploadSuccessCb &&
//         onUploadSuccessCb({ data, keyFile, addionalFileType });

//       return true;
//     } else {
//       setPreview(null);
//       return false;
//     }
//   } catch (error: any) {
//     setPreview(null);

//     if (error.response && error.response.data && error.response.data.message) {
//       setError(error.response.data.message);
//     } else {
//       setError("Request Error:" + error.message);
//     }

//     return false;
//   } finally {
//     setUploading(false);
//   }
// };
