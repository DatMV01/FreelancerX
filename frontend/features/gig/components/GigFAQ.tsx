import { GigDto } from "@/dto/gig.dto";
import React from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import { Typography } from "@mui/material";

const GigFAQ = ({ gig }: { gig: GigDto }) => {
  const { faqs } = gig;
  return (
    <div className="pt-4">
      <p className="my-4 text-2xl font-bold"> FAQs</p>

      {(faqs || []).map((faq) => (
        <Accordion key={faq.id} style={{ border: "none", boxShadow: "none" }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography component="span">
              <div className="flex items-center justify-center">
                <span className="pl-4 text-xl">{faq.question}</span>
              </div>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className="pl-6">{faq.answer}</div>
          </AccordionDetails>
        </Accordion>
      ))}

      <div className="h-20"></div>
    </div>
  );
};

export default GigFAQ;
