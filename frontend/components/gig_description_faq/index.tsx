import { Button } from "@mui/material";
import MyCkEditorWithNoSSR from "../ckeditor/intex";
import FrequentlyAskedQuestionsV2 from "./frequently_asked_questions_v2";

interface Props {
  switchToTab: (tab: string) => void;
  tabs: { label: string }[];
}

const GigDescriptionFaq = ({ switchToTab, tabs }: Props) => {
  return (
    <div className="flex w-full flex-col space-y-2">
      <div className="my-6">
        <p className="text-3xl">Description</p>
        <p className="text-sm">Briefly Describe Your Gig</p>
      </div>
      <MyCkEditorWithNoSSR />
      <div className="py-6">
        <p className="text-3xl">Frequently Asked Questions</p>
        <p className="text-sm">Add Questions & Answers for Your Buyers.</p>
      </div>
      {/* <FrequentlyAskedQuestions /> */}

      <FrequentlyAskedQuestionsV2 />

      <Button
        variant="contained"
        sx={{ alignSelf: "end" }}
        onClick={() => switchToTab(tabs[3].label)}
      >
        Save & Continue
      </Button>
    </div>
  );
};

export default GigDescriptionFaq;
