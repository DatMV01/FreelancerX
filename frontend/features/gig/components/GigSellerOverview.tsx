import { GigDto } from "@/dto/gig.dto";
import { Divider } from "@mui/material";
import React, { useEffect, useState } from "react";
import GigSellerRank from "./GigSellerRank";

const GigSellerOverview = ({ gig }: { gig: GigDto }) => {
  const [country, setCountry] = useState("");

  const [memberSince, setMemberSince] = useState("");

  const [languages, setLanguages] = useState();

  const [about, setAbout] = useState("");

  useEffect(() => {
    const { seller } = gig;

    const date = new Date(seller.createdAt);
    setMemberSince(
      `${date.toLocaleString("en-US", { month: "long" })} ${date.getFullYear()}`,
    );

    setLanguages(seller?.languages.join(","));

    setAbout(seller.about);

    setCountry(seller.country);
  }, []);

  return (
    <div className="rounded-lg border p-4">
      <GigSellerRank gig={gig} />

      <div className="space-y-2">
        <p>
          <strong>From:</strong> <span>{country}</span>
        </p>
        <p>
          <strong>Member since:</strong> <span>{memberSince}</span>
        </p>
        {/* <p>
          <strong>Avg. response time:</strong> <span>1 hour</span>
        </p> */}
        {/* <p>
          <strong>Last delivery:</strong> <span>2 days</span>
        </p> */}
        <p>
          <strong>Languages:</strong> <span>{languages}</span>
        </p>
        <Divider />
      </div>

      <div className="mt-4 hidden md:flex">
        <div className="text-gray-700">{about}</div>
      </div>
    </div>
  );
};

export default GigSellerOverview;
