"use client";

import BreadcrumbCpn from "@/components/breadcrumb";
import { Avatar, Tooltip } from "@mui/material";
import React from "react";

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

const MainContent = () => {
  return (
    <div className="w-2/3">
      <div>
        <p className="text-xl font-semibold">
          I will build your ecommerce shopify dropshipping website
        </p>
        <div className="mt-2 flex items-center">
          <div className="mr-2">
            {/* <Avatar
              className="h-6 w-6 text-[12px]"
              {...stringAvatar("Mai Dat")}
            /> */}
            <Avatar
              className="h-[90px] w-[90px]"
              alt="Remy Sharp"
              src="/avatar/1.jpg"
            />
          </div>

          <div>
            <p className="flex space-x-2 font-semibold">
              <Link href={"/"} className="text-sm font-bold hover:underline">
                Mai Dat
              </Link>
              <span className="flex w-fit flex-row items-center rounded bg-yellow-300 px-2 py-1 text-xs font-bold">
                <span>Top Rated</span>
                {[...Array(3)].map((_, i) => (
                  <Diamond
                    key={i}
                    size={10}
                    fill="currentColor"
                    stroke="none"
                  />
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
        <Divider className="my-4" />
      </div>

      <CarouselV2Fullscreen />
    </div>
  );
};

const SideBarContent = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
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
    <div className="fixed right-0 w-1/3 bg-slate-50">
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
  return (
    <div className="flex justify-between">
      <BreadcrumbCpn
        categoryInfo={{
          category: "programming-tech",
          subcategory: "website-development",
          subsubcategory: "shopify",
        }}
      />
    </div>
  );
};

const GigDetail = () => {
  return (
    <>
      <BreadcumSection />
      <div className="flex">
        <MainContent />
        <SideBarContent />
      </div>
    </>
  );
};

export default GigDetail;
