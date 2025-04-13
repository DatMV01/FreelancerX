import { programmingTechSubCategoriesExploreSection } from "@/data/explore-section";
import { useRouter } from "next/router";
import ScrollableDiv from "@/components/ScrollableDiv";
import {
     Accordion,
     AccordionContent,
     AccordionItem,
     AccordionTrigger,
} from "@/components/ui/accordion";
import { categories } from "@/data/data";
import { programmingTechFaqs } from "@/data/faq-section";
import { programmingTechInteresteds } from "@/data/interest-section";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

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
    </div>
  );
};

const MostPopular = ({ category, ...props }: { category: any }) => {
  const { title = "", mostPopulars = [] } = category;

  return (
    <div className="my-6">
      <h2 className="text-base font-bold">Most Popular in {title} </h2>

      <ScrollableDiv
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
      </ScrollableDiv>
    </div>
  );
};

const Explore = ({ title = "", ...props }: { title: string }) => {
  return (
    <div className="my-4">
      <h2 className="mb-4 text-base font-bold">Explore {title}</h2>

      {/* Mobile / Tablet: Accordion */}
      <div className="space-y-2 md:hidden">
        {programmingTechSubCategoriesExploreSection.map((category, index) => (
          <Accordion
            key={index}
            type="single"
            collapsible
            className="border-muted rounded-lg border shadow-sm"
          >
            <AccordionItem value={`item-${index}`}>
              <AccordionTrigger className="flex items-center gap-4 px-4">
                <img
                  src={category.bucketImage}
                  alt={category.bucketTitle}
                  className="aspect-video h-[50px] rounded-md object-cover"
                />
                <span className="font-bold">{category.bucketTitle}</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-2 pt-2">
                {category.bucketContent.map((item, subIndex) => (
                  <Link
                    key={subIndex}
                    href={item.href}
                    className="text-muted-foreground hover:bg-accent block rounded px-3 py-2 text-sm"
                  >
                    {item.name}
                  </Link>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>

      {/* Desktop: Grid layout */}
      <div className="hidden gap-6 md:grid md:grid-cols-3 lg:grid-cols-4">
        {programmingTechSubCategoriesExploreSection.map((category, index) => (
          <div key={index} className="space-y-2">
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl">
              <Image
                src={category.bucketImage}
                alt={category.bucketTitle}
                fill
                className="object-cover"
              />
            </div>
            <span className="block font-bold">{category.bucketTitle}</span>
            <div className="space-y-1">
              {category.bucketContent.map((item, subIndex) => (
                <Link
                  key={subIndex}
                  href={item.href}
                  className="text-muted-foreground hover:bg-accent block rounded px-3 py-2 text-sm"
                >
                  {item.name}
                </Link>
              ))}
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

const FAQ = ({ title = "", ...props }: { title: string }) => {
  return (
    <div className="rounded-sm bg-gray-50 p-4">
      <h2 className="mb-4 text-base font-bold">{title} FAQs</h2>

      <div className="space-y-2">
        {programmingTechFaqs.map((faq, index) => (
          <Accordion
            key={index}
            type="single"
            collapsible
            className="border-muted rounded-lg border-2 bg-gray-100 p-2"
          >
            <AccordionItem value={`faq-${index}`}>
              <AccordionTrigger className="text-left text-[16px] font-medium">
                {faq.title}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm">
                {faq.content}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>

      <div className="h-20" />
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

const RootCategoryPage = () => {
  const router = useRouter();

  const { slug } = router.query;
  if (!Array.isArray(slug)) return null;

  if (Array.isArray(slug) && Array.from(slug).length == 1) {
    const [category] = slug;

    if (category !== "programming-tech") {
      return (
        <div className="flex items-center justify-center text-center">
          <strong>
            <span>The category </span>
            <span className="capitalize">
              "{typeof category === "string" ? category.replace(/-/g, " ") : ""}
              "
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
        {/* <Guides title={title} /> */}
        <FAQ title={title} />
        <Interested title={title} />
      </div>
    );
  }

  return null;
};

export default RootCategoryPage;
