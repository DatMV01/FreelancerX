import { IconButton, Tooltip } from "@mui/material";
import { DeleteIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Masonry from "react-masonry-css";

const images = [
  "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_delivery_web_tile/v1/attachments/delivery/asset/191c6e31b9bfe0fd9b2fc451e27e85bb-1736450670/E9B43626-8420-4EEB-854E-BF12EA5226B9.png",
  "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_delivery_web_tile/v1/attachments/delivery/asset/f58a0ec0cbf150e8820d66215a2c9376-1737742372/Edit%2001_Living_View_02.png",
  "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_delivery_web_tile/v1/attachments/delivery/asset/c3c5d09628c579e6dcee504169d7a75a-1738523763/Enscape_2025-02-02-13-20-00.png",
  "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_delivery_web_tile/v1/attachments/delivery/asset/415621a20fb5072ce9a14c49c97b1c93-1737775736/living_3.png",
  "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_delivery_web_tile/v1/attachments/delivery/asset/520224652e8cd1c4726d8cd16d02a61c-1739318180/0592674F-1C7A-4063-8A92-3A31DA585669.png",
  "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_delivery_web_tile/v1/attachments/delivery/asset/21fadbcd4d139bf0d2ae12b9d82c3118-1737908482/Untitled-1.png",
  "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_delivery_web_tile/v1/attachments/delivery/asset/437f692c601e3a045a0363ed7cd61a57-1736420267/voidspore.jpg",
  "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_delivery_web_tile/v1/attachments/delivery/asset/cb6b2c8ed5ba7973b8db1c844392b5bd-1736069946/IMG_8116.jpeg",
  "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_delivery_web_tile/v1/attachments/delivery/asset/81ddfa32a7d78e205f1a508e69ba65a4-1739185390/Scene%201_2.png",
  "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_delivery_web_tile/v1/attachments/delivery/asset/1490cb7f3dc6eb6ceddd2f4e467e3392-1736972279/IMG_5405.jpeg",
  "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_delivery_web_tile/v1/attachments/delivery/asset/f77381c1c316bbc6b9c5d3495b1d4b24-1737463495/door%202%20chocolate.jpg",
];

const MasonryGrid = () => {
  const breakpointColumnsObj = {
    default: 4, // Desktop
    1024: 3, // Tablet
    640: 2, // Mobile
  };

  const saveToListHandle = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    console.log("====================================");
    console.log("saveToListHandle");
    console.log("====================================");
  };
  return (
    <div className="my-6">
      <Masonry breakpointCols={breakpointColumnsObj} className="flex gap-4">
        {images.map((src, index) => (
          <div className="relative">
            <div key={index} className="mb-4">
              <Link href="#">
                <Image
                  src={src}
                  alt={`Image ${index}`}
                  layout="responsive"
                  width={0}
                  height={0}
                  className="rounded-lg"
                />

                <div className="absolute bottom-5 left-2">
                  <div className="w-2/3 font-bold text-white">
                    Architecture & Interior Design by saadmaqsood
                  </div>
                </div>
              </Link>
            </div>

            <div className="absolute right-2 top-2">
              <Tooltip title="Save to list" placement="top">
                <button
                  className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-gray-100 fill-gray-500 hover:bg-gray-200"
                  onClick={(e) => saveToListHandle(e)}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 16 16"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M14.325 2.00937C12.5188 0.490623 9.72813 0.718748 8 2.47812C6.27188 0.718748 3.48125 0.487498 1.675 2.00937C-0.674996 3.9875 -0.331246 7.2125 1.34375 8.92187L6.825 14.5062C7.1375 14.825 7.55625 15.0031 8 15.0031C8.44688 15.0031 8.8625 14.8281 9.175 14.5094L14.6563 8.925C16.3281 7.21562 16.6781 3.99062 14.325 2.00937ZM13.5875 7.86875L8.10625 13.4531C8.03125 13.5281 7.96875 13.5281 7.89375 13.4531L2.4125 7.86875C1.27188 6.70625 1.04063 4.50625 2.64063 3.15937C3.85625 2.1375 5.73125 2.29062 6.90625 3.4875L8 4.60312L9.09375 3.4875C10.275 2.28437 12.15 2.1375 13.3594 3.15625C14.9563 4.50312 14.7188 6.71562 13.5875 7.86875Z"></path>
                  </svg>
                </button>
              </Tooltip>
            </div>

            {/* <div className="absolute bottom-2 right-2">
              <button className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-transparent fill-white hover:bg-gray-100 hover:fill-gray-500">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 16 4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentFill"
                >
                  <circle cx="2" cy="2" r="2"></circle>
                  <circle cx="8" cy="2" r="2"></circle>
                  <circle cx="14" cy="2" r="2"></circle>
                </svg>
              </button>
            </div> */}
          </div>
        ))}
      </Masonry>
    </div>
  );
};

export default MasonryGrid;
