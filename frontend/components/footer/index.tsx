"use client";

import Tiktok from "@/components/footer/tiktok";
import Logo from "@/components/LogoImage";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { useState } from "react";
import Facebook from "./facebook";
import Instagram from "./instagram";
import Linkedin from "./linkedin";
import { Divider } from "@mui/material";
import { categoriesMenuData } from "@/data/data";

const footerNav = [
  {
    title: "Categories",
    content: categoriesMenuData,
  },
  {
    title: "For Clients",
    content: [
      { title: "How FreelancerX Works", href: "#" },
      { title: "Customer Success Stories", href: "#" },
      { title: "Trust & Safety", href: "#" },
      { title: "Quality Guide", href: "#" },
      { title: "FreelancerX Learn Online Courses", href: "#" },
    ],
  },
  {
    title: "For Freelancers",
    content: [
      { title: "Become a FreelancerX Freelancer", href: "#" },
      { title: "Become an Agency", href: "#" },
      { title: "Kickstart", href: "#" },
      { title: "Community Hub", href: "#" },
    ],
  },
  {
    title: "Company",
    content: [
      { title: "About FreelancerX", href: "#" },
      { title: "Help & Support", href: "#" },
      { title: "Social Impact", href: "#" },
      { title: "Careers", href: "#" },
      { title: "Privacy Policy", href: "#" },
    ],
  },
];

const Footer = () => {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  return (
    <div>
      <Divider />
      <div className="md:hidden">
        {footerNav.map((nav, index) => (
          <Accordion
            key={index}
            type="single"
            collapsible
            value={openAccordion === nav.title ? nav.title : undefined}
            onValueChange={(value) => setOpenAccordion(value)}
          >
            <AccordionItem
              value={nav.title}
              className="border-none font-[Arial]"
            >
              <AccordionTrigger className="title-base h-[40px] font-bold">
                {nav.title}
              </AccordionTrigger>
              <AccordionContent className="title-base flex flex-col pb-0 pl-4">
                {nav.content.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    className="flex h-[40px] items-center hover:bg-gray-50"
                  >
                    {item.title}
                  </Link>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>

      <div className="mt-4 hidden md:grid md:grid-cols-4 md:gap-6">
        {footerNav.map((_, index) => (
          <div key={index}>
            <div className="py-4 font-bold">{_.title}</div>
            {_.content.map((__: any, idx) => (
              <Link
                key={__.id || idx}
                href={__.href}
                className="title-gray-600 hover:title-black block py-2"
              >
                {__.title}
              </Link>
            ))}
          </div>
        ))}
      </div>

      <div className="flex flex-col border-t sm:flex-row sm:justify-between">
        <div className="flex flex-col items-center sm:flex-row">
          <Link href="/">
            <Logo />
          </Link>
          <p className="pl-5">© FreelancerX Ltd. 2025</p>
        </div>
        <div className="my-2 flex items-center justify-center">
          {[Tiktok, Instagram, Linkedin, Facebook].map((Icon, idx) => (
            <Link key={idx} href="#" className="mx-2">
              <Icon />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Footer;
