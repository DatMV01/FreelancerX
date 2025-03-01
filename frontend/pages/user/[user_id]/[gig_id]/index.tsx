"use client";

import BreadcrumbCpn from "@/components/breadcrumb";
import { Avatar, Tooltip } from "@mui/material";
import React, { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Box, Divider, Tab, Tabs, Typography } from "@mui/material";
import { CheckCircle, Clock, Diamond, RefreshCw, Star } from "lucide-react";
import { useState } from "react";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";

import Link from "next/link";
import Carousel from "@/components/gig_card/carousel";
import CarouselFullScreen from "@/components/gig_card/carousel-fullscreen";
import CarouselV2 from "@/components/gig_card/carousel_v2";
import CarouselV2Fullscreen from "@/components/gig_card/carousel_v2_fullscreen";
import RatedDiamond from "@/components/gig_card/rated-diamond";
import EditableTable from "@/components/edited-table";
import { useRouter } from "next/router";

const TabPanel = ({
  children,
  value,
  index,
}: {
  children: any;
  value: any;
  index: any;
}) => {
  return (
    <div hidden={value !== index}>
      {value === index && (
        <div className="p-2">
          <div>{children}</div>
        </div>
      )}
    </div>
  );
};

const SellerOverviewSection = () => {
  return (
    <div>
      <p className="text-xl font-semibold">
        I will build your ecommerce shopify dropshipping website
      </p>
      <div className="my-2 flex items-center space-x-2">
        <Avatar
          className="h-[70px] w-[70px]"
          alt="Remy Sharp"
          src="/avatar/1.jpg"
        >
          A
        </Avatar>

        <div>
          <p className="flex space-x-2 font-semibold">
            <Link href={"/"} className="text-sm font-bold hover:underline">
              Mai Dat
            </Link>
            <span className="flex w-fit flex-row items-center rounded bg-yellow-300 px-2 py-1 text-xs font-bold">
              <span>Top Rated</span>
              {[...Array(3)].map((_, i) => (
                <Diamond key={i} size={10} fill="currentColor" stroke="none" />
              ))}
            </span>
          </p>
          <p className="text-sm text-gray-500">4 orders in queue</p>
          <div className="mt-1 flex items-center text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} fill="currentColor" stroke="none" />
            ))}
            <span className="ml-2 font-semibold text-black">5.0</span>
            <a href="#" className="ml-1 text-sm text-gray-500 underline">
              (221 reviews)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const MainContent = () => {
  const router = useRouter();
  const { user_id, gig_id } = router.query;

  return (
    <div className="w-2/3">
      <SellerOverviewSection />
      <CarouselV2Fullscreen />
      <AboutThisGig />
      <GigMetaData />
      <AboutSeller />
      <UserStats />
      <ComparePackage />
      <EditableTable />
      <FAQ />
      <Reviews />
      <CommentsSection />
      <button
        className="sticky bottom-10 rounded-full border-[1px] bg-white p-2"
        onClick={() => console.log("abc")}
      >
        <div className="flex items-center justify-center space-x-2">
          <AvatarOnline />
          <p className="font-semibold">Mesage {user_id} </p>
        </div>
      </button>
    </div>
  );
};

const SideBarContent = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className="sticky top-4 h-fit w-1/3 bg-white px-2">
      <div className="rounded-md border-2">
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label="Basic" />
          <Tab label="Standard" />
          <Tab label="Premium" />
        </Tabs>

        <TabPanel value={value} index={0}>
          <div className="w-full bg-white">
            <div className="my-2 flex justify-between">
              <p className="text-xl font-semibold">Starter Store</p>
              <p className="text-2xl font-bold">$555</p>
            </div>

            <div className="mt-2 text-sm text-gray-600">
              Premium Theme + Clean converting 5 winning product+logo & branding
              + product research +5 apps
            </div>

            <div className="mt-4 flex items-center space-x-4 text-gray-500">
              <span className="flex items-center gap-1">
                <Clock size={16} /> 7-day delivery
              </span>
              <span className="flex items-center gap-1">
                <RefreshCw size={16} /> 2 Revisions
              </span>
            </div>

            <div className="mt-4 border-t pt-4">
              <Accordion sx={{ boxShadow: "none", border: "none" }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  className="border-none p-0 shadow-none"
                >
                  <div className="font-semibold">What's Included</div>
                </AccordionSummary>

                <AccordionDetails className=" ">
                  <ul className="max-h-[300px] overflow-auto">
                    {[
                      "Functional website",
                      "7 pages",
                      "Responsive design",
                      "Content upload",
                      "3 plugins/extensions",
                      "Content upload",
                      "Payment Integration",
                      "Opt-in form",
                      "Autoresponder integration",
                      "5 Commercially licensed images",
                      "Social media icons",
                    ].map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="text-green-500" size={16} />{" "}
                        {item}
                      </li>
                    ))}
                  </ul>
                </AccordionDetails>
              </Accordion>
            </div>

            <Button className="mt-4 w-full">Continue</Button>
            <button className="mt-4 w-full">Compare packages</button>
          </div>
        </TabPanel>

        <TabPanel value={value} index={1}>
          <div className="w-full bg-white">
            <div className="my-2 flex justify-between">
              <p className="text-base font-semibold">
                Small Startups (BEST SELLING)
              </p>
              <p className="text-base font-bold">$805</p>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Premium Theme + Clean converting 5 winning product+logo & branding
              + product research +5 apps
            </p>
            <div className="mt-4 flex items-center space-x-4 text-gray-500">
              <span className="flex items-center gap-1">
                <Clock size={16} /> 7-day delivery
              </span>
              <span className="flex items-center gap-1">
                <RefreshCw size={16} /> 2 Revisions
              </span>
            </div>
            <div className="mt-4 border-t pt-4">
              <Accordion sx={{ boxShadow: "none", border: "none" }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  className="p-0"
                >
                  <Typography component="span">
                    <p className="font-semibold">What's Included</p>
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {[
                    "Functional website",
                    "7 pages",
                    "Responsive design",
                    "Content upload",
                    "3 plugins/extensions",
                    "E-commerce functionality",
                    "5 products",
                    "Payment Integration",
                    "Opt-in form",
                    "Autoresponder integration",
                    "Speed optimization",
                    "Hosting setup",
                    "5 Commercially licensed images",
                    "Social media icons",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="text-green-500" size={16} />{" "}
                      {item}
                    </li>
                  ))}
                </AccordionDetails>
              </Accordion>
            </div>
            <Button className="mt-4 w-full">Continue</Button>
            <button className="mt-4 w-full">Compare packages</button>
          </div>
        </TabPanel>

        <TabPanel value={value} index={2}>
          <div className="w-full bg-white">
            <div className="my-2 flex justify-between">
              <p className="text-base font-semibold">
                Advanced Store Setup (RECOMMENDED)
              </p>
              <p className="text-base font-bold">$905</p>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Premium Theme + Clean converting 5 winning product+logo & branding
              + product research +5 apps
            </p>
            <div className="mt-4 flex items-center space-x-4 text-gray-500">
              <span className="flex items-center gap-1">
                <Clock size={16} /> 7-day delivery
              </span>
              <span className="flex items-center gap-1">
                <RefreshCw size={16} /> 2 Revisions
              </span>
            </div>
            <div className="mt-4 border-t pt-4">
              <Accordion sx={{ boxShadow: "none", border: "none" }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  className="p-0"
                >
                  <Typography component="span">
                    <p className="font-semibold">What's Included</p>
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {[
                    "Functional website",
                    "7 pages",
                    "Responsive design",
                    "Content upload",
                    "3 plugins/extensions",
                    "E-commerce functionality",
                    "5 products",
                    "Payment Integration",
                    "Opt-in form",
                    "Autoresponder integration",
                    "Speed optimization",
                    "Hosting setup",
                    "5 Commercially licensed images",
                    "Social media icons",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="text-green-500" size={16} />{" "}
                      {item}
                    </li>
                  ))}
                </AccordionDetails>
              </Accordion>
            </div>
            <Button className="mt-4 w-full">Continue</Button>
            <button className="mt-4 w-full">Compare packages</button>
          </div>
        </TabPanel>
      </div>
      <div className="mt-4 rounded-sm bg-[#FAFAFA] p-4">
        <button className="h-8 w-full rounded-sm border-[1px] border-black bg-white text-black">
          Contact me
        </button>
      </div>
    </div>
  );
};

const BreadcumSection = () => {
  const saveToListHandle = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    console.log("====================================");
    console.log("saveToListHandle");
    console.log("====================================");
  };

  return (
    <div className="flex justify-between">
      <BreadcrumbCpn
        categoryInfo={{
          category: "programming-tech",
          subcategory: "website-development",
          subsubcategory: "shopify",
        }}
      />
      <div className="my-4 flex justify-end px-4">
        <Tooltip title="Save to list" placement="top">
          <button
            className="flex items-center justify-center rounded-full bg-transparent"
            onClick={(e) => saveToListHandle(e)}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              xmlns="http://www.w3.org/2000/svg"
              className="fill-[#b5b6ba]"
            >
              <path d="M14.4469 1.95625C12.7344 0.496875 10.1875 0.759375 8.61561 2.38125L7.99999 3.01562L7.38436 2.38125C5.81561 0.759375 3.26561 0.496875 1.55311 1.95625C-0.409388 3.63125 -0.512513 6.6375 1.24374 8.45312L7.29061 14.6969C7.68124 15.1 8.31561 15.1 8.70624 14.6969L14.7531 8.45312C16.5125 6.6375 16.4094 3.63125 14.4469 1.95625Z"></path>
            </svg>
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

const AboutThisGig = () => {
  return (
    <div className="bg-white">
      <p className="mb-4 text-2xl font-bold">About this gig</p>
      <p className="font-semibold text-yellow-600">
        <a href="#" className="hover:underline">
          Are you in search of a professional WordPress website developer or
          want to redesign your existing website?
        </a>
      </p>
      <p className="mt-4">
        Having vast experience in <strong>WordPress Website Development</strong>
        , I can build a 100% mobile responsive website design or redesign your
        site that will meet your needs and exceed your expectations.
      </p>

      <p className="mt-6 flex items-center text-xl font-bold">
        <Star /> Overview of Expertise:
      </p>
      <ul className="mt-2 list-inside list-disc space-y-1">
        {[
          "Professional design",
          "Website Redesign",
          "Custom layout",
          "Elementor Pro",
          "Mobile Friendly Design",
          "Speed Optimization",
          "Domain and Web Hosting",
          "Payment Integration",
          "Web Security",
          "HD Stock Images and Icons",
          "Search Engine Optimization (SEO)",
          "UI/UX development",
          "Membership & Booking Functionality",
          "Migration",
          "Site Backup",
          "Maintenance",
        ].map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      <h3 className="mt-6 flex items-center text-xl font-bold">
        <Star /> Why Me:
      </h3>
      <ul className="mt-2 list-inside list-disc space-y-1">
        <li>
          <strong>Video walkthrough</strong> to teach you how to manage and edit
          your WordPress design.
        </li>
        <li>
          Developed more than <strong>500 WordPress sites</strong>.
        </li>
        <li>
          Great <strong>Communication</strong>.
        </li>
        <li>
          Also, with over 3 years as a{" "}
          <strong>Cyber Security specialist</strong>, I'll make sure your site
          is super secure.
        </li>
      </ul>

      <p className="mt-6 border-t pt-4 font-semibold text-yellow-700">
        Quality work and client satisfaction is guaranteed. Don't hesitate to
        contact me if you need any help or advice, I would like to discuss your
        project.
      </p>
    </div>
  );
};

const GigMetaData = () => {
  const websiteFeatures = [
    "Marketing",
    "Payment",
    "Shipping",
    "Analytics",
    "Form",
    "Events",
    "Chat",
    "Membership",
    "Gallery",
    "Booking",
  ];

  const plugins = [
    "Adsense",
    "Akismet",
    "All-in-one SEO pack",
    "Contact form 7",
    "Facebook",
    "GetResponse",
    "Gravity Forms",
    "Instagram",
    "LinkedIn",
    "Mailchimp",
    "Paypal",
    "Twitter",
    "W3 Total Cache",
    "WooCommerce",
    "WordPress SEO by Yoast",
    "Elementor",
    "Other",
  ];

  return (
    <div className="py-6">
      <div className="flex flex-col md:flex-row md:justify-between">
        <div className="md:mb-0 md:w-1/2">
          <h2 className="text-lg font-bold">Website Type</h2>
          <p className="text-gray-600">Business</p>
        </div>

        <div className="md:mb-0 md:w-1/2">
          <h3 className="text-md mb-2 font-semibold">Website Features</h3>
          <ul className="list-disc pl-5 text-gray-700">
            {websiteFeatures.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
        <div className="md:w-1/2">
          <h3 className="text-md mb-2 font-semibold">Plugins</h3>
          <ul className="list-disc pl-5 text-gray-700">
            {plugins.map((plugin, index) => (
              <li key={index}>{plugin}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const AboutSeller = () => {
  return (
    <div className="mt-6">
      <p className="my-4 text-2xl font-bold">Get to know Mai Dat</p>

      <div className="flex items-center">
        <div className="mr-2">
          {/* <Avatar
              className="h-6 w-6 text-[12px]"
              {...stringAvatar("Mai Dat")}
            /> */}
          <Avatar
            alt="Remy Sharp"
            src="/avatar/1.jpg"
            sx={{ width: 70, height: 70 }}
          />
        </div>

        <div>
          <div className="flex space-x-2 font-semibold">
            <Link href={"/"} className="text-sm font-bold hover:underline">
              Mai Dat
            </Link>
            <span className="flex w-fit flex-row items-center rounded bg-yellow-300 px-2 py-1 text-xs font-bold">
              <span>Top Rated</span>
              {[...Array(3)].map((_, i) => (
                <Diamond key={i} size={10} fill="currentColor" stroke="none" />
              ))}
            </span>
          </div>
          <div className="text-sm text-gray-500">
            WordPress Website Developer
          </div>
          <div className="mt-1 flex items-center text-black">
            <div className="flex items-center justify-center space-x-2">
              <div className="flex items-center justify-center">
                <Star fill="currentColor" stroke="none" size={16} />
                <span className="text-base font-semibold text-black">5.0</span>
                <a href="#" className="ml-1 text-base text-gray-500 underline">
                  (221 reviews)
                </a>
              </div>

              <Divider orientation="vertical" flexItem />

              <div className="flex items-center">
                <span className="mr-2 text-[12px]">Level 2</span>
                {Array.from({ length: 2 }, (_, i) => i + 1).map((a) => (
                  <RatedDiamond />
                ))}

                <RatedDiamond color={"#E4E5E7"} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <button className="my-2 rounded-md border-[1px] border-black p-2">
        Contact me
      </button>
    </div>
  );
};

const UserStats = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="w-full rounded-lg border-[1px] bg-white p-4">
      <div className="space-y-2">
        <p>
          <strong>From:</strong> <span>Pakistan</span>
        </p>
        <p>
          <strong>Member since:</strong> <span>Dec 2022</span>
        </p>
        <p>
          <strong>Avg. response time:</strong> <span>1 hour</span>
        </p>
        <p>
          <strong>Last delivery:</strong> <span>2 days</span>
        </p>
        <p>
          <strong>Languages:</strong> <span>Urdu, English, French, German</span>
        </p>
        <Divider />
      </div>

      <article className="mt-4 hidden md:flex">
        <div className="text-gray-700">
          <p>
            Hello! I'm Mujtaba, an experienced Engineer and Certified Web
            Developer with a proven track record spanning over 5 years in Web
            Design and Development. I am also a Cyber Security specialist with
            more than 3 years of experience in the field.
          </p>
          <p className="mt-2">
            Specializing in WordPress, I craft responsive and captivating
            websites that empower my clients to outshine their competitors. My
            expertise lies in creating dynamic and user-friendly WordPress
            websites that seamlessly adapt across all devices. Let's collaborate
            to bring your web vision to life and elevate your online presence.
          </p>
        </div>
      </article>

      <article className="mt-4">
        <div className="text-gray-700">
          <p>
            Hello! I'm Mujtaba, an experienced Engineer and Certified Web
            Developer with a proven track record spanning over 5 years in Web
            Design and Development.
          </p>

          <div
            className={`overflow-hidden transition-[max-height] duration-1000 ease-in-out ${expanded ? "max-h-96 scale-100 opacity-100" : "max-h-0 scale-95 opacity-0"}`}
          >
            <p className="mt-2">
              I am also a Cyber Security specialist with more than 3 years of
              experience in the field. Specializing in WordPress, I craft
              responsive and captivating websites that empower my clients to
              outshine their competitors. My expertise lies in creating dynamic
              and user-friendly WordPress websites that seamlessly adapt across
              all devices. Let's collaborate to bring your web vision to life
              and elevate your online presence.
            </p>
          </div>
        </div>
        <button
          className="mt-4 rounded-lg underline md:hidden"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "See Less" : "See More"}
        </button>
      </article>
    </div>
  );
};

const ComparePackage = () => {
  const headers = ["Feature", "Basic", "Standard", "Premium"];
  const features = [
    { name: "Price", values: ["$80", "$350", "$495"] },
    { name: "Pages", values: ["1", "4", "7"] },
    { name: "Plugins", values: ["4", "6", "8"] },
    { name: "Products", values: ["-", "-", "5"] },
    { name: "Revisions", values: ["Unlimited", "Unlimited", "Unlimited"] },
    { name: "Delivery", values: ["2 days", "3 days", "4 days"] },
    { name: "Extra Delivery", values: ["$100", "$150", "$200"] },
    { name: "Functional website", values: ["✔", "✔", "✔"] },
    { name: "Responsive design", values: ["✔", "✔", "✔"] },
    { name: "Content upload", values: ["✔", "✔", "✔"] },
    { name: "E-commerce functionality", values: ["-", "-", "✔"] },
    { name: "Payment Integration", values: ["-", "-", "✔"] },
    { name: "Opt-in form", values: ["✔", "✔", "✔"] },
    { name: "Speed optimization", values: ["✔", "✔", "✔"] },
    { name: "Social media icons", values: ["✔", "✔", "✔"] },
  ];

  return (
    <div className="my-4">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            {headers.map((header, index) => (
              <th key={index} className="border p-3">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {features.map((feature, index) => (
            <tr key={index} className="text-center">
              <td className="border p-3 font-bold">{feature.name}</td>
              {feature.values.map((value, i) => (
                <td key={i} className="border p-3">
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const FAQ = ({ title = "", ...props }: { title?: any }) => {
  const faqs = [
    {
      title: "What I need first before we start?",
      content:
        "Provide domain & hosting services with cPanel.Provide a logo, about us page, list of services, contact info, and reference websites.Each service should have a 1-2 paragraph description.",
    },
    {
      title: "Will you offer hosting or domain?",
      content:
        "No, we do not offer any. But we can develop your site on our temporary domains and at the end we will migrate your site to your hosting when its done.",
    },
    {
      title: "Will it be easy for me to edit my website?",
      content: "Yes, on-page SEO will be included.",
    },
    {
      title:
        "I'll show you a website that I like, can you create one similar to that?",
      content:
        "Sure, I can create a wordpress website design similar to the one you like. Just show me the website and I will take it from there. I can also make changes to the design to fit your specific needs.",
    },
    {
      title: "Can you redesign my existing website?",
      content:
        "Yes! I specialize in wordpress website designs and website redesigns, breathing new life into your existing site, enhancing its aesthetics, functionality, and user experience. Let's transform your online presence for better engagement and results.",
    },
  ];
  return (
    <div className="pt-4">
      <p className="my-4 text-2xl font-bold">{title} FAQs</p>

      {faqs.map((faq) => (
        <Accordion style={{ border: "none", boxShadow: "none" }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography component="span">
              <div className="flex items-center justify-center">
                <span className="pl-4 text-[16px]">{faq.title}</span>
              </div>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className="pl-4">{faq.content}</div>
          </AccordionDetails>
        </Accordion>
      ))}

      <div className="h-20"></div>
    </div>
  );
};

const Reviews = () => {
  return (
    <div>
      <div className="m-4 text-2xl font-bold">Reviews</div>
      <GigReviews />
    </div>
  );
};

const RatingBar = ({
  stars,
  count,
  total,
}: {
  stars: number;
  count: number;
  total: number;
}) => {
  return (
    <tr>
      <td className="w-14 whitespace-nowrap text-gray-700">{stars} Stars</td>
      <td className="w-full">
        <div className="h-2 overflow-hidden rounded-lg bg-gray-200">
          <div
            className="h-full bg-black"
            style={{ width: `${(count / total) * 100}%` }}
          ></div>
        </div>
      </td>
      <td className="ml-2 text-gray-700">({count})</td>
    </tr>
  );
};

const GigReviews = () => {
  const totalReviews = 314;
  const ratings = [
    { stars: 5, count: 307 },
    { stars: 4, count: 7 },
    { stars: 3, count: 0 },
    { stars: 2, count: 0 },
    { stars: 1, count: 0 },
  ];

  return (
    <div className="rounded-lg bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">
          {totalReviews} reviews for this Gig
        </p>

        <div className="mt-1 flex items-center text-black">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-5 w-5 fill-black" />
          ))}
          <span className="ml-2 text-lg font-semibold">5.0</span>
        </div>
      </div>

      <table className="mt-4 space-y-2">
        <tbody>
          {ratings.map(({ stars, count }) => (
            <RatingBar
              key={stars}
              stars={stars}
              count={count}
              total={totalReviews}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
import { LoremIpsum } from "lorem-ipsum";
import { Card, CardContent } from "@/components/ui/card";
import CommentBox from "@/components/comment";
import { faker } from "@faker-js/faker";
import AvatarOnline from "@/components/avatar_online";

const CommentsSection = () => {
  interface Review {
    user: {
      username: string;
      avatar: string;
      country: string;
      repeatClient: boolean;
    };
    content: string;
    replies: string;
  }

  const [reviews, setReviews] = useState<Review[]>([]);

  const lorem = new LoremIpsum({
    sentencesPerParagraph: {
      max: 8,
      min: 4,
    },
    wordsPerSentence: {
      max: 16,
      min: 4,
    },
  });

  useEffect(() => {
    const initialReviews = Array.from({ length: 10 }, () => comment());
    setReviews(initialReviews as any);
  }, []);

  const comment = () => {
    return {
      user: {
        username: faker.internet.username(),
        avatar: faker.image.avatar(),
        country: faker.location.country(),
        repeatClient: faker.datatype.boolean(0.5),
      },
      content: lorem.generateSentences(7),
      replies: lorem.generateSentences(3),
    };
  };

  const loadMoreReviews = () => {
    const newReviews = Array.from({ length: 5 }, () => comment());
    setReviews((prevReviews) => [...prevReviews, ...newReviews]);
  };

  return (
    <div className="my-4 space-y-4">
      <div className="space-y-4">
        {reviews && reviews.map((r) => <CommentBox comment={r} />)}
      </div>
      <button
        className="rounded-md border-[1px] border-black bg-white p-2 font-bold text-black"
        onClick={loadMoreReviews}
      >
        Show More Reviews
      </button>
    </div>
  );
};

const ServiceAlsoViewed = () => {
  return (
    <div className="my-8">
      <p className="text-xl font-bold">
        People Who Viewed This Service Also Viewed
      </p>
    </div>
  );
};

const BrowsingHistory = () => {
  return (
    <div className="my-8">
      <p className="text-xl font-bold">Browsing History</p>
    </div>
  );
};

const GigDetail = () => {
  return (
    <>
      <BreadcumSection />
      <div className="relative flex gap-4">
        <MainContent />
        <SideBarContent />
      </div>
      <ServiceAlsoViewed />
      <BrowsingHistory />
    </>
  );
};

export default GigDetail;
