"use client";

import Tiktok from "@/components/footer/tiktok";
import Logo from "@/components/logo";
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
    <div className="mt-4">
      <div>
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
                    className="flex h-[40px] items-center"
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
                "Freelancer Connect Learn (Online Courses)",
                "Freelancer Connect Guides",
                "Freelancer Connect Answers",
              ].map((link) => (
                <Link
                  key={uuidv4()}
                  href="#"
                  className="flex h-[40px] items-center"
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
                  className="flex h-[40px] items-center"
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
                "About Freelancer Connect",
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
                  className="flex h-[40px] items-center"
                  onClick={() => toggleAccordion("item-4")}
                >
                  {link}
                </Link>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div
        className={clsx(
          "flex flex-col border-t-[1px]",
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
            <span className="copyright">© FC International Ltd. 2025</span>
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
