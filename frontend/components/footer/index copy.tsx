"use client";

import Tiktok from "@/components/footer/tiktok";
import Logo from "@/components/LogoImage";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { categories } from "@/data/data";
import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";
import Facebook from "./facebook";
import Instagram from "./instagram";
import Linkedin from "./linkedin";
import { v4 as uuidv4 } from "uuid";
import { Divider } from "@mui/material";

const footerNav = [
  {
    title: "Categories",
    content: [
      { text: "Graphics & Design", href: "/categories/graphics-design" },
      { text: "Digital Marketing", href: "/categories/online-marketing" },
      {
        text: "Writing & Translation",
        href: "/categories/writing-translation",
      },
      { text: "Video & Animation", href: "/categories/video-animation" },
      { text: "Music & Audio", href: "/categories/music-audio" },
      { text: "Programming & Tech", href: "/categories/programming-tech" },
      { text: "AI Services", href: "/categories/ai-services" },
      { text: "Consulting", href: "/categories/consulting-services" },
      { text: "Data", href: "/categories/data" },
      { text: "Business", href: "/categories/business" },
      { text: "Personal Growth & Hobbies", href: "/categories/lifestyle" },
      { text: "Photography", href: "/categories/photography" },
      { text: "Finance", href: "/categories/finance" },
      { text: "End-to-End Projects", href: "/categories/end-to-end-projects" },
      { text: "Service Catalog", href: "/categories" },
    ],
  },
  {
    title: "For Clients",
    content: [
      {
        text: "How Fiverr Works",
        href: "/cp/how-fiverr-works?show_join&source=footer",
      },
      {
        text: "Customer Success Stories",
        href: "/cp/success-stories?source=footer",
      },
      {
        text: "Trust & Safety",
        href: "/trust_safety?source=footer",
      },
      {
        text: "Quality Guide",
        href: "https://help.fiverr.com/hc/en-us/articles/25616781230481-Fiverr-s-guide-to-quality-and-trust",
      },
      {
        text: "Fiverr Learn Online Courses",
        href: "https://learn.fiverr.com",
      },
      {
        text: "Fiverr Guides",
        href: "/resources/guides?source=footer",
      },
      {
        text: "Fiverr Answers",
        href: "https://answers.fiverr.com/",
      },
    ],
  },
  {
    title: "For Freelancer",
    content: [
      {
        text: "Become a Fiverr Freelancer",
        href: "/start_selling?source=footer",
      },
      {
        text: "Become an Agency",
        href: "/cp/apply-fiverr-agencies?source=footer",
      },
      {
        text: "Freelancer Equity Program",
        href: "/cp/freelancer-equity-program",
      },
      {
        text: "Kickstart",
        href: "/cp/kickstart-program?source=footer",
      },
      {
        text: "Community Hub",
        href: "https://community.fiverr.com",
      },
      {
        text: "Forum",
        href: "https://community.fiverr.com/forums/",
      },
      {
        text: "Events",
        href: "https://events.fiverr.com",
      },
    ],
  },
  {
    title: "Company",
    content: [
      { text: "About Fiverr", href: "/about-us?source=footer" },
      { text: "Help & Support", href: "https://help.fiverr.com/hc/en-us" },
      { text: "Social Impact", href: "/social-impact?source=footer" },
      { text: "Careers", href: "/jobs?source=footer" },
      { text: "Terms of Service", href: "/legal-portal?source=footer" },
      {
        text: "Privacy Policy",
        href: "/legal-portal/privacy/privacy-policy?source=footer",
      },
      { text: "Partnerships", href: "/partnerships?source=footer" },
      { text: "Creator Network", href: "/partnerships/creators" },
      { text: "Affiliates", href: "/partnerships/affiliates" },
      { text: "Invite a Friend", href: "/referral_program?source=footer" },
      { text: "Press & News", href: "/news/press-releases?source=footer" },
      { text: "Investor Relations", href: "https://investors.fiverr.com" },
    ],
  },
];

const Footer = () => {
  const [openAccordion1, setOpenAccordion1] = useState<string | null>(null);
  const [openAccordion2, setOpenAccordion2] = useState<string | null>(null);
  const [openAccordion3, setOpenAccordion3] = useState<string | null>(null);
  const [openAccordion4, setOpenAccordion4] = useState<string | null>(null);

  const toggleAccordion = (value: string) => {
    setOpenAccordion1(openAccordion1 === value ? null : value);
    setOpenAccordion2(openAccordion2 === value ? null : value);
    setOpenAccordion3(openAccordion3 === value ? null : value);
    setOpenAccordion4(openAccordion4 === value ? null : value);
  };

  return (
    <div>
      <Divider />
      <div>
        <div className="md:hidden">
          <Accordion
            type="single"
            collapsible
            value={openAccordion1 as any}
            onValueChange={setOpenAccordion1}
          >
            <AccordionItem value="item-1" className="border-none font-[Arial]">
              <AccordionTrigger className="h-[40px] text-base font-bold">
                Categories
              </AccordionTrigger>

              {categories &&
                categories.map((category) => (
                  <AccordionContent
                    className="flex h-[40px] items-center pb-0 pl-4 text-base"
                    key={category.id}
                  >
                    <Link
                      key={uuidv4()}
                      href={`/categories/${category.slug}`}
                      className="flex h-[40px] w-full items-center hover:bg-gray-50"
                      onClick={() => toggleAccordion("item-1")}
                    >
                      {category.title}
                    </Link>
                  </AccordionContent>
                ))}
            </AccordionItem>
          </Accordion>

          <Accordion
            type="single"
            collapsible
            value={openAccordion2 as any}
            onValueChange={setOpenAccordion2}
          >
            <AccordionItem value="item-2" className="border-none font-[Arial]">
              <AccordionTrigger className="h-[40px] text-base font-bold">
                For Clients
              </AccordionTrigger>

              <AccordionContent className="flex flex-col pb-0 pl-4 text-base">
                {[
                  "How Fiverr Works",
                  "Customer Success Stories",
                  "Trust & Safety",
                  "Quality Guide",
                  "FreelancerX Learn (Online Courses)",
                  "FreelancerX Guides",
                  "FreelancerX Answers",
                ].map((link) => (
                  <Link
                    key={uuidv4()}
                    href="#"
                    className="flex h-[40px] items-center hover:bg-gray-50"
                    onClick={() => toggleAccordion("item-2")}
                  >
                    {link}
                  </Link>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Accordion
            type="single"
            collapsible
            value={openAccordion3 as any}
            onValueChange={setOpenAccordion3}
          >
            <AccordionItem value="item-3" className="border-none font-[Arial]">
              <AccordionTrigger className="h-[40px] text-base font-bold">
                For Freelancers
              </AccordionTrigger>

              <AccordionContent className="flex flex-col pb-0 pl-4 text-base">
                {[
                  "Become a Fiverr Freelancer",
                  "Become an Agency",
                  "Kickstart",
                  "Forum",
                  "Events",
                ].map((link) => (
                  <Link
                    key={uuidv4()}
                    href="#"
                    className="flex h-[40px] items-center hover:bg-gray-50"
                    onClick={() => toggleAccordion("item-3")}
                  >
                    {link}
                  </Link>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Accordion
            type="single"
            collapsible
            value={openAccordion4 as any}
            onValueChange={setOpenAccordion4}
          >
            <AccordionItem value="item-4" className="border-none font-[Arial]">
              <AccordionTrigger className="h-[40px] text-base font-bold">
                Company
              </AccordionTrigger>

              <AccordionContent className="flex flex-col pb-0 pl-4 text-base">
                {[
                  "About FreelancerX",
                  "Help &amp; Support",
                  "Social Impact",
                  "Careers",
                  "Terms of Service",
                  "Privacy Policy",
                  "Do not sell or share my personal information",
                  "Partnerships",
                  "Creator Network",
                  "Affiliates",
                  "Invite a Friend",
                  "Press & News",
                  "Investor Relations",
                ].map((link) => (
                  <Link
                    key={uuidv4()}
                    href="#"
                    className="flex h-[40px] items-center hover:bg-gray-50"
                    onClick={() => toggleAccordion("item-4")}
                  >
                    {link}
                  </Link>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="mt-4 hidden md:grid md:grid-cols-4 md:gap-6">
          {footerNav.map((nav, index) => (
            <div key={index}>
              <div>
                <div className="flex flex-col">
                  <span className="py-4 font-bold">{nav.title}</span>
                </div>

                <div>
                  {nav.content.map((c, index) => (
                    <div
                      key={index}
                      className="hover:pointer flex h-12 items-center text-base text-[#62646a] hover:bg-gray-50"
                    >
                      <Link className="w-full" href={c.href}>
                        {c.text}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className={clsx(
          "my-4 flex flex-col border-t-[1px]",
          "sm:flex-row sm:justify-between",
          "md:flex-row",
          "lg:flex-row",
        )}
      >
        <div
          className={clsx(
            "left",
            "flex flex-col items-center",
            "sm:flex-row",
            "md:flex-row",
            "lg:flex-row",
          )}
        >
          <Link href="/" className="justify-self-center">
            <Logo />
          </Link>
          <p className={clsx("pl-5")}>
            <span className="copyright">© FreelancerX Ltd. 2025</span>
          </p>
        </div>

        <div
          className={clsx(
            "bottom",
            "flex flex-col items-center",
            "sm:flex-row",
            "md:flex-row",
            "lg:flex-row",
          )}
        >
          <div>
            <ul
              className={clsx(
                "flex flex-row items-center justify-center [&_svg]:mx-2 [&_svg]:fill-[#74767E]",
                "sm:flex-row sm:[&_svg]:mx-1 sm:[&_svg]:h-[25px] sm:[&_svg]:w-[25px]",
                "md:flex-row",
                "lg:flex-row",
              )}
            >
              <li>
                <Link href="#">
                  <Tiktok />
                </Link>
              </li>

              <li>
                <Link href="#">
                  <Instagram />
                </Link>
              </li>

              <li>
                <Link href="#">
                  <Linkedin />
                </Link>
              </li>

              <li>
                <Link href="#">
                  <Facebook />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
