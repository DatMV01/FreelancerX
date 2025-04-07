import { categories } from "@/data/data";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

const Banner = ({ category, ...props }: { category: any }) => {
  const { title, slogen } = category;
  return (
    <div
      className={clsx(
        "relative flex h-[300px] flex-col items-center justify-center gap-4 rounded-md md:h-[370px]",
        "bg-[rgb(37,66,0)] bg-contain bg-center",
        "bg-[url('https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto/v1/attachments/generic_asset/asset/67119574fcb6178f7b270ef6e50d2ff5-1689143593532/Programing.png')]",
      )}
    >
      <h1 className="text-3xl text-white">{title}</h1>

      <p
        dangerouslySetInnerHTML={{ __html: slogen }}
        className="text-center text-xl text-white"
      />

      {/* <div className="w-[90%] md:hidden">
        <SearchBar />
      </div> */}
    </div>
  );
};

const MostPopular = ({ category, ...props }: { category: any }) => {
  const { title = "", mostPopulars = [] } = category;

  return (
    <div className="my-6">
      <h2 className="text-base font-bold">Most Popular in {title} </h2>

      <ScrollableDiv2
        showScrollBar={true}
        showLeftRightButton={true}
        layout="grid grid-cols-[repeat(3,_300px)] grid-rows-3 gap-3 overflow-auto scroll-smooth py-2 md:grid-cols-[repeat(9,_300px)] md:grid-rows-1"
      >
        {/* <div className="scrollbar grid grid-cols-[repeat(3,_300px)] grid-rows-3 gap-3 overflow-auto scroll-smooth py-2 md:grid-cols-[repeat(9,_300px)] md:grid-rows-1"> */}
        {mostPopulars.map((_: any, index: any) => (
          <Link href={_.url} key={index}>
            <div className="mr-4 flex h-[75px] w-[300px] items-center rounded-lg bg-slate-50 p-4 font-bold shadow hover:fill-green-600 hover:text-green-600">
              <span className="relative">
                <Image
                  alt="logo"
                  src={_.icon}
                  width={50}
                  height={50}
                  style={{ objectFit: "cover" }}
                />
              </span>

              <span className="flex-grow">{_.title}</span>
              <span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.92332 2.96885C9.63854 2.66807 9.1768 2.66807 8.89202 2.96885C8.60723 3.26963 8.60723 3.75729 8.89202 4.05807L11.6958 7.01931H1.48616C1.08341 7.01931 0.756918 7.36413 0.756918 7.7895C0.756918 8.21487 1.08341 8.5597 1.48616 8.5597H11.8436L8.89202 11.677C8.60723 11.9778 8.60723 12.4654 8.89202 12.7662C9.1768 13.067 9.63854 13.067 9.92332 12.7662L14.0459 8.41213C14.3307 8.11135 14.3307 7.62369 14.0459 7.32291L13.977 7.25011C13.9737 7.24661 13.9704 7.24315 13.9671 7.23972L9.92332 2.96885Z"></path>
                </svg>
              </span>
            </div>
          </Link>
        ))}
        {/* </div> */}
      </ScrollableDiv2>
    </div>
  );
};

import ScrollableDiv2 from "@/components/scrollable-div-2";
import { programmingTechSubCategoriesExploreSection } from "@/data/explore-section";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import clsx from "clsx";
import { programmingTechFaqs } from "@/data/faq-section";
import { programmingTechInteresteds } from "@/data/interest-section";

const Explore = ({ title = "", ...props }: { title: any }) => {
  return (
    <div className="my-4">
      <h2 className="text-base font-bold">Explore {title} </h2>

      <div className="md:hidden">
        {programmingTechSubCategoriesExploreSection.map((category, index) => (
          <Accordion className="border-none shadow-none" key={index}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography component="span">
                <div className="flex items-center justify-center">
                  <img
                    className="aspect-video h-[50px]"
                    src={category.bucketImage}
                  />
                  <span className="pl-4 font-bold">{category.bucketTitle}</span>
                </div>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {category.bucketContent.map((_, index) => (
                <div
                  key={index}
                  className="hover:pointer flex h-10 items-center text-base text-[#62646a] hover:bg-gray-50"
                >
                  <Link className="w-full" href={_.href}>
                    {_.name}
                  </Link>
                </div>
              ))}
            </AccordionDetails>
          </Accordion>
        ))}
      </div>

      <div className="hidden gap-6 md:visible md:grid md:grid-cols-3 lg:grid-cols-4">
        {programmingTechSubCategoriesExploreSection.map((category, index) => (
          <div key={index}>
            <div>
              <div className="flex flex-col">
                <div className="relative aspect-video w-full rounded-2xl">
                  <Image alt="" src={category.bucketImage} fill />
                </div>
                <span className="py-4 font-bold">{category.bucketTitle}</span>
              </div>

              <div>
                {category.bucketContent.map((_, index) => (
                  <div
                    key={index}
                    className="hover:pointer flex min-h-8 items-center text-base text-[#62646a] hover:bg-gray-50"
                  >
                    <Link className="w-full" href={_.href}>
                      {_.name}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Guides = ({ title = "", ...props }: { title: any }) => {
  return (
    <div className="py-4">
      <h2 className="text-base font-bold">Guides related to {title}</h2>
      <p>Not implement</p>
    </div>
  );
};

const FAQ = ({ title = "", ...props }: { title: any }) => {
  return (
    <div className="bg-[#FAFAFA] pt-4">
      <h2 className="text-base font-bold">{title} FAQs</h2>

      {programmingTechFaqs.map((faq, index) => (
        <Accordion className="border-none bg-[#FAFAFA] shadow-none" key={index}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography component="span">
              <div className="flex items-center justify-center">
                <span className="text-[16px]">{faq.title} </span>
              </div>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className=" ">{faq.content}</div>
          </AccordionDetails>
        </Accordion>
      ))}

      <div className="h-20"></div>
    </div>
  );
};

const Interested = ({ title = "", ...props }: { title: any }) => {
  return (
    <div className="pb-8">
      <h2 className="w-full p-8 text-center text-2xl font-bold">
        You might be interested in {title}
      </h2>

      <div className="flex flex-wrap items-center justify-center">
        {programmingTechInteresteds.map((_, index) => (
          <Link
            key={index}
            href={_.link}
            className="m-1 w-fit rounded-3xl bg-[#EFEFF0] px-4 py-1 font-medium hover:bg-gray-300"
          >
            {_.title}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default function Page() {
  const router = useRouter();
  const { category, subcategory, subsubcategory } = router.query;

  if (category !== "programming-tech") {
    return (
      <div className="flex items-center justify-center text-center">
        <strong>
          <span>The category </span>
          <span className="capitalize">
            "{typeof category === "string" ? category.replace(/-/g, " ") : ""}"
          </span>
          <span> is under development.</span>
        </strong>
      </div>
    );
  }

  const categoryData = categories.find((c) => c.slug == category);

  if (!categoryData) return;

  const { title } = categoryData;

  return (
    <div>
      <Banner category={categoryData} />
      <MostPopular category={categoryData} />
      <Explore title={title} />
      <Guides title={title} />
      <FAQ title={title} />
      <Interested title={title} />
    </div>
  );
}
