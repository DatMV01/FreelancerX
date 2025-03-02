import { categories } from "@/data/data";
import { useRouter } from "next/router";
import { faker } from "@faker-js/faker";
import Image from "next/image";
import Link from "next/link";

const Banner = ({ category, ...props }: { category: any }) => {
  const { title, slogen } = category;
  return (
    <div
      className={clsx(
        "relative z-10 flex h-[250px] w-full flex-col items-center justify-center",
        "bg-[rgb(37,66,0)] bg-contain bg-center",
        "bg-[url('https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto/v1/attachments/generic_asset/asset/67119574fcb6178f7b270ef6e50d2ff5-1689143593532/Programing.png')]",
      )}
    >
      <h1 className="mb-6 text-3xl text-white">{title}</h1>

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

      <ScrollableDiv2
        showScrollBar={true}
        showLeftRightButton={true}
        layout="grid grid-cols-[repeat(3,_300px)] grid-rows-3 gap-3 overflow-auto scroll-smooth py-2 md:grid-cols-[repeat(9,_300px)] md:grid-rows-1"
      >
        {/* <div className="scrollbar grid grid-cols-[repeat(3,_300px)] grid-rows-3 gap-3 overflow-auto scroll-smooth py-2 md:grid-cols-[repeat(9,_300px)] md:grid-rows-1"> */}
        {mostPopulars.map((m: any) => (
          <Link href={m.url}>
            <div className="mr-4 flex h-[75px] w-[300px] items-center rounded-lg bg-slate-50 p-4 font-bold shadow hover:fill-green-600 hover:text-green-600">
              <span className="relative h-[50px] w-[50px]">
                <Image
                  alt="logo"
                  src={m.icon}
                  fill
                  objectFit="cover"
                  className=""
                />
              </span>

              <span className="flex-grow">{m.title}</span>
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

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import clsx from "clsx";
import { useRef, useState } from "react";
import ScrollableDiv from "@/components/scrollable-div";
import ScrollableDiv2 from "@/components/scrollable-div-2";
import SearchBar from "@/components/searchbar";

const Explore = ({ title = "", ...props }: { title: any }) => {
  const programmingTechSubCategories = [
    {
      bucketTitle: "Websites",
      bucketImage:
        "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto/v1/attachments/generic_asset/asset/3baf91d2ca0c49f0973f2f9e3e210f86-1682409420385/Website%20Development.png",
      bucketContent: [
        {
          name: "Website Development",
          href: "/categories/programming-tech/website-development?source=vertical-buckets",
        },
        {
          name: "Website Maintenance",
          href: "/categories/programming-tech/website-maintenance?source=vertical-buckets",
        },
        {
          name: "WordPress",
          href: "/categories/programming-tech/website-development/wordpress-development?source=vertical-buckets",
        },
        {
          name: "Shopify",
          href: "/categories/programming-tech/website-development/shopify-development?source=vertical-buckets",
        },
        {
          name: "Custom Websites",
          href: "/categories/programming-tech/website-development/custom-websites-development?source=vertical-buckets",
        },
      ],
    },
    {
      bucketTitle: "Application Development",
      bucketImage:
        "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto/v1/attachments/generic_asset/asset/529ea44f10a2aff520b99859d285b968-1682409451031/Application%20Development.png",
      bucketContent: [
        {
          name: "Web Applications",
          href: "/categories/programming-tech/software-development/web-application?source=vertical-buckets",
        },
        {
          name: "Desktop Applications",
          href: "/categories/programming-tech/software-development/desktop-applications?source=vertical-buckets",
        },
        {
          name: "Game Development",
          href: "/categories/programming-tech/game-development?source=vertical-buckets",
        },
        {
          name: "Chatbot Development",
          href: "/categories/programming-tech/chatbots?source=vertical-buckets",
        },
        {
          name: "Browser Extensions",
          href: "/categories/programming-tech/software-development/browser-extension?source=vertical-buckets",
        },
      ],
    },
    {
      bucketTitle: "Software Development",
      bucketImage:
        "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto/v1/attachments/generic_asset/asset/ef81b98de711dd7acf41673de41d9e68-1698847862069/Software%20Development.png",
      bucketContent: [
        {
          name: "Software Development",
          href: "/categories/programming-tech/software-development?source=vertical-buckets",
        },
        {
          name: "AI Development",
          href: "/categories/programming-tech/ai-coding?source=vertical-buckets",
        },
        {
          name: "APIs & Integrations",
          href: "/categories/programming-tech/software-development/api-integrations?source=vertical-buckets",
        },
        {
          name: "Scripting",
          href: "/categories/programming-tech/software-development/scripting?source=vertical-buckets",
        },
        {
          name: "Plugins Development",
          href: "/categories/programming-tech/software-development/plugins-development?source=vertical-buckets",
        },
      ],
    },
    {
      bucketTitle: "Mobile Apps",
      bucketImage:
        "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto/v1/attachments/generic_asset/asset/2e10aef5cce6986a6b9cf898dd6ac29b-1698847839877/Mobile%20Apps.png",
      bucketContent: [
        {
          name: "Mobile App Development",
          href: "/categories/programming-tech/mobile-app-services?source=vertical-buckets",
        },
        {
          name: "Cross-platform Apps",
          href: "/categories/programming-tech/mobile-app-services/custom-app?source=vertical-buckets",
        },
        {
          name: "Android App Development",
          href: "/categories/programming-tech/mobile-app-services/android-development?source=vertical-buckets",
        },
        {
          name: "iOS App Development",
          href: "/categories/programming-tech/mobile-app-services/ios-development?source=vertical-buckets",
        },
        {
          name: "Mobile App Maintenance",
          href: "/categories/programming-tech/mobile-app-maintenance?source=vertical-buckets",
        },
      ],
    },
    {
      bucketTitle: "Website Platforms",
      bucketImage:
        "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto/v1/attachments/generic_asset/asset/b0cb91002a72133eba335482257f618c-1682409435227/Website%20Platforms.png",
      bucketContent: [
        {
          name: "Wix",
          href: "/categories/programming-tech/website-development/wix-development?source=vertical-buckets",
        },
        {
          name: "Webflow",
          href: "/categories/programming-tech/website-development/webflow-development?source=vertical-buckets",
        },
        {
          name: "GoDaddy",
          href: "/categories/programming-tech/website-development/godaddy-development?source=vertical-buckets",
        },
        {
          name: "Squarespace",
          href: "/categories/programming-tech/website-development/squarespace-development?source=vertical-buckets",
        },
        {
          name: "WooCommerce",
          href: "/categories/programming-tech/website-development/woocommerce-development?source=vertical-buckets",
        },
      ],
    },
    {
      bucketTitle: "Support & Cybersecurity",
      bucketImage:
        "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto/v1/attachments/generic_asset/asset/9fb4f27f2fd14209a356f858759f2cf5-1682409462866/Support%20_%20Cybersecurity.png",
      bucketContent: [
        {
          name: "Support & IT",
          href: "/categories/programming-tech/support-it-services?source=vertical-buckets",
        },
        {
          name: "Cloud Computing",
          href: "#!",
        },
        {
          name: "DevOps Engineering",
          href: "/categories/programming-tech/devops?source=vertical-buckets",
        },
        {
          name: "Cybersecurity",
          href: "/categories/programming-tech/cybersecurity-data-protection?source=vertical-buckets",
        },
        {
          name: "Development for Streamers",
          href: "/categories/programming-tech/development-for-streamers?source=vertical-buckets",
        },
        {
          name: "Convert Files",
          href: "/categories/programming-tech/file-conversion-services?source=vertical-buckets",
        },
      ],
    },
    {
      bucketTitle: "Blockchain & Cryptocurrency",
      bucketImage:
        "https://fiverr-res.cloudinary.com/image/upload/attachments/generic_asset/asset/c276d6e9b4859d7963688ee17dc23713-1715072487616/Blockchain%20_%20Cryptocurrency.png",
      bucketContent: [
        {
          name: "Blockchain Development & Solutions",
          href: "/categories/programming-tech/blockchain-cryptocurrency?source=vertical-buckets",
        },
        {
          name: "Decentralized Apps (dApps)",
          href: "/categories/programming-tech/blockchain-cryptocurrency/decentralized-application?source=vertical-buckets",
        },
        {
          name: "Coin Design & Tokenization",
          href: "/categories/programming-tech/cryptocurrencies-tokens/coin-design-tokenization?source=vertical-buckets",
        },
        {
          name: "Blockchain Security & Auditing",
          href: "/categories/programming-tech/blockchain-cryptocurrency/security-audits?source=vertical-buckets",
        },
        {
          name: "Exchange Platforms",
          href: "/categories/programming-tech/cryptocurrencies-tokens/cryptocurrency-trading-platforms?source=vertical-buckets",
        },
      ],
    },
    {
      bucketTitle: "Miscellaneous",
      bucketImage:
        "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto/v1/attachments/generic_asset/asset/a9a58d5d610faf4134f2f31a90773814-1682409478754/Miscellaneous.png",
      bucketContent: [
        {
          name: "Electronics Engineering",
          href: "/categories/programming-tech/electronics-engineering?source=vertical-buckets",
        },
        {
          name: "QA & Review",
          href: "/categories/programming-tech/qa-services?source=vertical-buckets",
        },
        {
          name: "User Testing",
          href: "/categories/programming-tech/user-testing-services?source=vertical-buckets",
        },
        {
          name: "Online Coding Lessons",
          href: "/categories/programming-tech/online-coding-lessons?source=vertical-buckets",
        },
      ],
    },
  ];

  return (
    <div className="my-4">
      <h2 className="text-base font-bold">Explore {title} </h2>

      <div className="md:hidden">
        {programmingTechSubCategories.map((category) => (
          <Accordion className="border-none shadow-none">
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
              {category.bucketContent.map((c) => (
                <div className="hover:pointer flex h-10 items-center text-base text-[#62646a] hover:bg-gray-50">
                  <Link className="w-full" href={c.href}>
                    {c.name}
                  </Link>
                </div>
              ))}
            </AccordionDetails>
          </Accordion>
        ))}
      </div>

      <div className="hidden gap-6 md:visible md:grid md:grid-cols-3 lg:grid-cols-4">
        {programmingTechSubCategories.map((category) => (
          <div>
            <div>
              <div className="flex flex-col">
                <div className="relative aspect-video w-full rounded-2xl">
                  <Image alt="" src={category.bucketImage} fill />
                </div>
                <span className="py-4 font-bold">{category.bucketTitle}</span>
              </div>

              <div>
                {category.bucketContent.map((c) => (
                  <div className="hover:pointer flex min-h-8 items-center text-base text-[#62646a] hover:bg-gray-50">
                    <Link className="w-full" href={c.href}>
                      {c.name}
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
  const faqs = [
    {
      title: "What is Web programming?",
      content:
        "Web programming or development use code to focus on the website functionality and ensure it works and is easy to use. It involves markup, writing, network security and coding which is client and server side. The most popular web programming languages are HTML, XML, JavaScript, PHP, ASP.Net and Python.",
    },
    {
      title: "How do I choose the right freelance programmer for my project?",
      content:
        "With so many programming services, it’s a challenge to choose the right programmer. Formulate a clear brief, decide on a budget, deadlines and scope. Select a programmer based not only on their skills and experience but also on how well you might work and communicate.",
    },
    {
      title: "Do I need to prepare something for my programmer?",
      content:
        "Yes, good documentation and a clear brief are crucial for the success of getting the desired result for your project. Formulate your initial high level idea and brainstorm it until you have a clear vision. Next, turn your idea into detailed functionality requirements for the backend programming and detail your technical requirements (platform, devices etc.) Also add non-functional requirements e.g. performance, security, load and clearly specify the scope of the project.",
    },
    {
      title: "What type of services can I find in Programming & Tech?",
      content:
        "Starting with web development for client-side (frontend) and server-side (backend), the category also offers specialists in Wordpress and e-commerce development, mobile or desktop apps, support & cybersecurity, as well as user testing and QA.",
    },
    {
      title: "How do I find good developers on Fiverr?",
      content:
        "Fiverr offers a huge choice of developers, so refine your requirements to determine whether you need a full-stack developer - proficient at both backend (server-side) and frontend (client-side) or a more narrow specialist. Get quotes and discuss your needs with at least 3 developers for an informed decision.",
    },
    {
      title: "Can I hire developers in less than 48 hours?",
      content:
        "Yes, on Fiverr we have developers worldwide available 24/7. If you need urgent bug fixing, have a cyber security emergency or a server load issue, you can be sure that a professional on Fiverr is within reach. Publish a buyer request or  make direct contact for best results.",
    },
  ];
  return (
    <div className="bg-[#FAFAFA] pt-4">
      <h2 className="text-base font-bold">{title} FAQs</h2>

      {faqs.map((faq) => (
        <Accordion className="border-none bg-[#FAFAFA] shadow-none">
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
  const interesteds = [
    {
      title: "Fivem Script",
      link: "/categories/programming-tech/buy/game-development/customization/fivem",
    },
    {
      title: "Convert Website to App",
      link: "/categories/programming-tech/mobile-app-services/convert-site-to-app",
    },
    {
      title: "Custom App",
      link: "/categories/programming-tech/mobile-app-services/custom-app",
    },
    { title: "Discord Server", link: "/gigs/discord-server" },
    { title: "Python Developer", link: "/gigs/python-developer" },
    { title: "PHP Programmer", link: "/hire/php-programmer" },
    { title: "Unity Developer", link: "/gigs/unity-game-developer" },
    {
      title: "Discord Chatbot",
      link: "/categories/programming-tech/buy/chatbots/discord",
    },
    {
      title: "Twitch Trivia Bot",
      link: "/categories/programming-tech/buy/chatbots/trivia-gaming",
    },
    { title: "Shopify Expert", link: "/gigs/shopify-expert" },
    {
      title: "Wix website builder",
      link: "/categories/programming-tech/website-development/wix-development",
    },
    {
      title: "Squarespace Programmer",
      link: "/categories/programming-tech/website-development/squarespace-development",
    },
    { title: "Roblox Scripter", link: "/hire/roblox-scripter" },
    { title: "Bloxburg Builder", link: "/hire/bloxburg-builder" },
    { title: "Minecraft Builders", link: "/hire/minecraft-builder" },
    {
      title: "Wordpress Customization",
      link: "/categories/programming-tech/buy/website-maintenance/customization/wordpress",
    },
    {
      title: "Book Formatting",
      link: "/categories/programming-tech/file-conversion-services/convert-to-e-book",
    },
    {
      title: "Custom Landing Page",
      link: "/categories/programming-tech/buy/website-development/custom-websites-development/landing-page",
    },
    { title: "Web Scraping", link: "/categories/data/data-mining" },
    { title: "NFT Promotion", link: "/gigs/nft-promotion" },
  ];

  return (
    <div className="pb-8">
      <h2 className="w-full p-8 text-center text-2xl font-bold">
        You might be interested in {title}
      </h2>

      <div className="flex flex-wrap items-center justify-center">
        {interesteds.map((i) => (
          <Link
            href={i.link}
            className="m-1 w-fit rounded-3xl bg-[#EFEFF0] px-4 py-1 font-medium hover:bg-gray-300"
          >
            {i.title}
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
      <SearchBar title={title} />
      <Banner category={categoryData} />
      <MostPopular category={categoryData} />
      <Explore title={title} />
      <Guides title={title} />
      <FAQ title={title} />
      <Interested title={title} />
    </div>
  );
}
