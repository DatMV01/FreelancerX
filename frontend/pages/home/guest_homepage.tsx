import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { categories, subCategoriesByCategory } from "@/data/data";
import Image from "next/image";
import Link from "next/link";
import { VisuallyHidden } from "radix-ui";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from "swiper/modules";
import "swiper/css";
import "swiper/css/scrollbar";
import clsx from "clsx";
import LoginForm from "@/features/auth/components/LoginForm";
import MasonryGrid from "./masonry-grid";

const CategoriesSection = () => (
  <div className="my-6 grid grid-cols-3 gap-3 md:grid-cols-4">
    {categories.map((category) => (
      <Link
        key={category.id}
        href={`/categories/${category.slug}`}
        className="flex flex-col items-center gap-y-3 transition-transform hover:scale-105"
      >
        <div className="flex h-[100px] w-[100px] items-center justify-center rounded-2xl border-2">
          <Image
            width={40}
            height={40}
            src={category.icon2}
            alt={category.title}
          />
        </div>
        <p className="text-center">{category.title}</p>
      </Link>
    ))}
  </div>
);

const PopularServiceSectionSwipper = () => {
  const [slideSize, setSlideSize] = useState({
    width: "120px",
    height: "170px",
  });

  useEffect(() => {
    const updateSize = () => {
      if (window.innerWidth < 640) {
        setSlideSize({ width: "100px", height: "150px" });
      } else if (window.innerWidth >= 1024) {
        setSlideSize({ width: "150px", height: "200px" });
      } else {
        setSlideSize({ width: "120px", height: "170px" });
      }
    };
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <Swiper
      modules={[Scrollbar]}
      scrollbar={{ draggable: true, hide: true }}
      spaceBetween={15}
      slidesPerView="auto"
    >
      {subCategoriesByCategory.map((category: any) => (
        <SwiperSlide key={category.id} style={slideSize}>
          <Link href={`/categories/${category.slug}`}>
            <div className="flex h-full flex-col justify-between rounded-lg bg-gradient-to-b from-green-900 via-green-500 to-green-300 p-1">
              <p className="line-clamp-2 h-[50px] text-center text-white">
                {category.title}
              </p>
              <div className="relative h-2/3">
                <Image
                  className="rounded-lg"
                  alt={category.title}
                  fill
                  src="/images/website-development.webp"
                  style={{ objectFit: "cover" }}
                  priority
                />
              </div>
            </div>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

const LoginDialogGuestHomePage = () => {
  const [isShowLoginForm, setShowLoginForm] = useState(false);

  return (
    <Dialog open={isShowLoginForm} onOpenChange={setShowLoginForm}>
      <DialogTrigger asChild>
        <button className="rounded-sm border border-green-500 bg-green-500 px-4 py-2 text-xl text-white transition-colors hover:bg-green-700">
          Join Now
        </button>
      </DialogTrigger>
      <DialogContent className="animate-fade-in w-full max-w-md rounded-md bg-white px-0 py-4">
        <VisuallyHidden.Root>
          <DialogTitle>Login</DialogTitle>
          <DialogDescription>Sign in to your account</DialogDescription>
        </VisuallyHidden.Root>
        <LoginForm setShowLoginForm={setShowLoginForm} />
      </DialogContent>
    </Dialog>
  );
};

const Banner = ({ slogen }: { slogen: string }) => {
  return (
    <div className="relative z-10 flex h-[300px] w-full flex-col items-center justify-center gap-4 rounded-md bg-green-900 bg-[url('/images/banner.png')] bg-cover bg-center md:h-[370px]">
      <h1 className="text-3xl text-white">FreelancerX</h1>
      <p
        dangerouslySetInnerHTML={{ __html: slogen }}
        className="text-center text-xl text-white md:text-4xl"
      />
    </div>
  );
};

const FingerTips2 = () => {
  return (
    <div className="my-6 flex h-[250px] w-full flex-col items-center justify-between rounded-lg bg-[#4d1727] px-6 py-8">
      <h2 className="text-center text-3xl text-white">
        Freelance services at your <br />
        <span className="text-[#ff7640]">fingertips</span>
      </h2>

      <LoginDialogGuestHomePage />
    </div>
  );
};

const GuestHomePage = () => {
  return (
    <div className="my-2">
      <Banner
        slogen={"Scale your professional workforce <br/> with freelancers"}
      />
      <CategoriesSection />
      <PopularServiceSectionSwipper />

      <FingerTips2 />
    </div>
  );
};

export default GuestHomePage;
