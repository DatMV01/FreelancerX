import { Button, CircularProgress } from "@mui/material";
import { useState } from "react";
import MyCkEditorWithNoSSR from "../ckeditor/intex";
import FrequentlyAskedQuestions from "./frequently_asked_questions";

interface Props {
  switchToTab: (tab: string) => void;
  tabs: { label: string }[];
  gig: any;
  setGig: any;
}

const GigDescriptionFaq = ({ switchToTab, tabs, setGig, gig }: Props) => {
  const [uploading, setUploading] = useState(false);

  return (
    <div className="relative flex w-full flex-col space-y-2">
      {uploading && (
        <div className="absolute inset-0 z-50 m-0 flex items-center justify-center bg-black bg-opacity-50">
          <CircularProgress />
        </div>
      )}

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

      <Button
        variant="contained"
        sx={{ alignSelf: "end" }}
        onClick={async () => {
          if (true) {
            // setUploading(true);
            // const isUploadOk = await hanleOnSaveAndCountinue();
            // setUploading(false);
            // isUploadOk &&
            switchToTab(tabs[3].label);
          }
        }}
      >
        Continue
      </Button>
    </div>
  );
};

export default GigDescriptionFaq;
