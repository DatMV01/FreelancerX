import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { categories, subCategoriesByCategory } from "@/data/data";
import LoginForm from "@/features/auth/components/LoginForm";
import clsx from "clsx";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { VisuallyHidden } from "radix-ui";
import React, { useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import { toast } from "sonner";
import { Scrollbar } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const CategoriesSection = () => {
  return (
    <ul
      className={clsx(
        "my-6 grid grid-cols-3 grid-rows-3 gap-3",
        "md:grid-cols-9 md:grid-rows-1 md:[&>li:nth-child(n+9)]:block",
        //"lg:grid-cols-9 lg:grid-rows-1 lg:[&>li:nth-child(n+9)]:block",
      )}
    >
      {categories.map((category) => (
        <li key={category.id}>
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className="flex flex-col items-center gap-y-3"
          >
            <div className="flex aspect-square w-full items-center justify-center rounded-2xl border-2">
              <Image
                width="0"
                height="0"
                src={category.icon2}
                alt=""
                className="h-1/2 w-1/2"
              ></Image>
            </div>
            <p className="text-center"> {category.title}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export const PopularServiceSectionSwipper = () => {
  const [slideWidth, setSlideWidth] = useState("120px");
  const [slideHeight, setSlideHeight] = useState("170px");

  useEffect(() => {
    const updateWidth = () => {
      if (window.innerWidth < 640) {
      } else if (window.innerWidth >= 640) {
      } else if (window.innerWidth >= 768) {
      } else if (window.innerWidth >= 1024) {
      } else if (window.innerWidth >= 1280) {
      } else if (window.innerWidth >= 1536) {
      }
    };

    window.addEventListener("resize", updateWidth);
    updateWidth();

    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return (
    <Swiper
      modules={[Scrollbar]}
      scrollbar={{ draggable: true, hide: true }}
      spaceBetween={15}
      slidesPerView={"auto"}
      className="my-4 w-full"
      style={{ paddingBottom: "10px" }}
    >
      {subCategoriesByCategory.map((category: any, index) => {
        return (
          <SwiperSlide
            key={index}
            style={{ width: slideWidth, height: slideHeight }}
          >
            <Link key={category.id} href={`/categories/${category.slug}`}>
              <div
                className={`flex h-full flex-col justify-between rounded-lg bg-gradient-to-b from-green-900 via-green-500 to-green-300 p-1`}
              >
                <p className="line-clamp-2 h-[50px] overflow-hidden text-center text-ellipsis text-white">
                  {category.title}
                </p>

                <div className="relative h-2/3">
                  <Image
                    className="rounded-lg"
                    alt="Website Development"
                    fill
                    src="/images/website-development.webp"
                    style={{ objectFit: "cover" }}
                    priority
                  />
                </div>
              </div>
            </Link>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

const FingerTips = () => {
  return (
    <div className="flex flex-col items-center py-4">
      <div className="flex flex-col items-center space-y-2 space-x-2 md:flex-row">
        <h2 className="text-center text-2xl text-[#404145]">
          Make it all happen with freelancers
        </h2>
        <LoginDialogGuestHomePage />
      </div>
      <ul className="grid grid-cols-1 gap-1 md:grid-cols-2">
        <li className="flex flex-row items-center">
          <Image
            src="/finger-tips/categories.8badf97.svg"
            height={0}
            width={0}
            alt="Access a pool of top talent across 700 categories"
            className="my-2 mr-2 h-12 w-12"
          />
          <p className="text-ml max-w-xs">
            Access a pool of top talent across 700 categories
          </p>
        </li>
        <li className="flex flex-row items-center">
          <Image
            src="/finger-tips/matching.0eef7cc.svg"
            height={0}
            width={0}
            alt="Enjoy a simple, easy-to-use matching experience"
            className="my-2 mr-2 h-12 w-12"
          />

          <p className="text-ml max-w-xs">
            Enjoy a simple, easy-to-use matching experience
          </p>
        </li>
        <li className="flex flex-row items-center">
          <Image
            src="/finger-tips/quickly.6879514.svg"
            height={0}
            width={0}
            alt="Get quality work done quickly and within budget"
            className="my-2 mr-2 h-12 w-12"
          />

          <p className="text-ml max-w-xs">
            Get quality work done quickly and within budget
          </p>
        </li>
        <li className="flex flex-row items-center">
          <Image
            src="/finger-tips/happy.42ed7bd.svg"
            height={0}
            width={0}
            alt="Only pay when you’re happy"
            className="my-2 mr-2 h-12 w-12"
          />

          <p className="text-ml max-w-xs">Only pay when you’re happy</p>
        </li>
      </ul>
    </div>
  );
};

const LoginDialogGuestHomePage = ({ className }: { className?: any }) => {
  const [isShowLoginForm, setShowLoginForm] = useState(false);

  return (
    <>
      <Dialog open={isShowLoginForm} onOpenChange={setShowLoginForm}>
        <DialogTrigger asChild>
          <button className="rounded-sm border border-green-500 bg-green-500 px-4 py-2 text-xl text-white">
            Join Now
          </button>
        </DialogTrigger>

        <DialogContent className="w-full max-w-md rounded-md bg-white px-0 py-4">
          <VisuallyHidden.Root>
            <DialogTitle>Login</DialogTitle>
            <DialogDescription>Sign in to your account</DialogDescription>
          </VisuallyHidden.Root>

          <LoginForm setShowLoginForm={setShowLoginForm} />
        </DialogContent>
      </Dialog>
    </>
  );
};

const MakeOnFreelancerX = () => {
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

  const breakpointColumnsObj = {
    default: 4, // Desktop
    1024: 3, // Tablet
    640: 2, // Mobile
  };

  const saveToListHandle = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    toast.info("Under development");
  };
  return (
    <div className="my-6">
      <Masonry breakpointCols={breakpointColumnsObj} className="flex gap-2">
        {images.map((src, index) => (
          <div key={index} className="relative">
            <div className="mb-2">
              <Link href="#">
                <img
                  src={src}
                  alt={`Image ${index}`}
                  className="rounded-sm object-cover"
                />
              </Link>
            </div>

            <div className="absolute top-2 right-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger onClick={(e) => saveToListHandle(e)}>
                    <p className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-gray-100 fill-gray-500 hover:bg-gray-200">
                      <Heart size={18} />
                    </p>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Save to lis</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* <div className="absolute right-2 bottom-2">
              <button className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-transparent fill-white hover:bg-gray-100 hover:fill-gray-500">
                <Ellipsis className="stroke-gray-5900" />
              </button>
            </div> */}
          </div>
        ))}
      </Masonry>
    </div>
  );
};

const FingerTips2 = () => {
  return (
    <div className="flex h-[250px] w-full flex-col items-center justify-between rounded-lg bg-[#4d1727] px-6 py-8">
      <h2 className="text-center text-3xl text-white">
        Freelance services at your <br />
        <span className="text-[#ff7640]">fingertips</span>
      </h2>

      <LoginDialogGuestHomePage className="px-4" />
    </div>
  );
};
``;

const Banner = ({ slogen }: { slogen: string }) => {
  const companies = [
    {
      name: "Meta",
      src: "https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/meta.ff37dd3.svg",
      width: 70,
      height: 14,
    },
    {
      name: "Google",
      src: "https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/google.e74f4d9.svg",
      width: 53.41,
      height: 17.87,
    },
    {
      name: "Netflix",
      src: "https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/netflix.b310314.svg",
      width: 53.64,
      height: 14.37,
    },
    {
      name: "P&G",
      src: "https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/pg.22fca85.svg",
      width: 33.13,
      height: 13.8,
    },
    {
      name: "PayPal",
      src: "https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/paypal.d398de5.svg",
      width: 53.01,
      height: 12.69,
    },
    {
      name: "Payoneer",
      src: "https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/payoneer.7c1170d.svg",
      width: 82.42,
      height: 16,
    },
  ];

  return (
    <div className="relative h-[300px] w-full overflow-hidden rounded-md md:h-[300px] lg:h-[400px] xl:h-[500px]">
      <Image
        src="/new-hero-md.webp"
        alt="Banner"
        fill
        className="object-fill"
      />
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 text-white">
        <h1 className="text-3xl">FreelancerX</h1>
        <p
          dangerouslySetInnerHTML={{ __html: slogen }}
          className="text-center text-xl md:text-2xl"
        />
        <div className="flex flex-col items-center space-y-2">
          <span className="text-base font-semibold text-gray-300">
            Trusted by:
          </span>
          <ul className="flex flex-wrap justify-center gap-4">
            {companies.map((company, index) => (
              <li key={index} className="animate-fade-in">
                <Image
                  src={company.src}
                  alt={company.name}
                  width={company.width}
                  height={company.height}
                  className="object-contain"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const PublicHomePage = () => {
  return (
    <div className="flex flex-col">
      <Banner
        slogen={"Scale your professional workforce <br/> with freelancers"}
      />

      <CategoriesSection />
      <FingerTips />
      <MakeOnFreelancerX />
      <FingerTips2 />
    </div>
  );
};

export default PublicHomePage;
