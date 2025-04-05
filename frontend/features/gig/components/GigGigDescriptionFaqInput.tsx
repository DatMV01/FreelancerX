import MyCkEditorWithNoSSR from "@/components/ckeditor/intex";
import FrequentlyAskedQuestions from "@/components/gig_description_faq/frequently_asked_questions";
import { Button, CircularProgress } from "@mui/material";
import { useState } from "react";

interface Props {
  switchToTab: (tab: string) => void;
  tabs: { label: string }[];
  gig: any;
  setGig: any;
}

const GigGigDescriptionFaqInput = ({
  switchToTab,
  tabs,
  setGig,
  gig,
}: Props) => {
 
  return (
    <div className="relative flex w-full flex-col space-y-2">
      <div className="my-6">
        <p className="text-3xl">Description</p>
        <p className="text-sm">Briefly Describe Your Gig</p>
      </div>

      <MyCkEditorWithNoSSR setGig={setGig} gig={gig} />

      <div className="py-6">
        <p className="text-3xl">Frequently Asked Questions</p>
        <p className="text-sm">Add Questions & Answers for Your Buyers.</p>
      </div>

      <FrequentlyAskedQuestions setGig={setGig} gig={gig} />
    </div>
  );
};

export default GigGigDescriptionFaqInput;
