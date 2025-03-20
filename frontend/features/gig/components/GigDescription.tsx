import { GigDto } from "@/dto/gig.dto";
import React from "react";

const GigDescription = ({ gig }: { gig: GigDto }) => {
  const { description } = gig;
  return (
    <div className="my-2">
      <p className="text-2xl font-bold">About this gig</p>

      <div dangerouslySetInnerHTML={{ __html: description || "" }}></div>
    </div>
  );
};

export default GigDescription;
