import { GigDto } from "@/dto/gig.dto";
import { Divider } from "@mui/material";
import React from "react";
import GigSellerRank from "./GigSellerRank";

const GigSellerOverview = ({ gig }: { gig: GigDto }) => {
  return (
    <div className="  rounded-lg border p-4">
      <GigSellerRank gig={gig} />

      <div className="space-y-2">
        <p>
          <strong>From:</strong> <span>Pakistan</span>
        </p>
        <p>
          <strong>Member since:</strong> <span>Dec 2022</span>
        </p>
        <p>
          <strong>Avg. response time:</strong> <span>1 hour</span>
        </p>
        <p>
          <strong>Last delivery:</strong> <span>2 days</span>
        </p>
        <p>
          <strong>Languages:</strong> <span>Urdu, English, French, German</span>
        </p>
        <Divider />
      </div>

      <article className="mt-4 hidden md:flex">
        <div className="text-gray-700">
          <p>
            Hello! I'm Mujtaba, an experienced Engineer and Certified Web
            Developer with a proven track record spanning over 5 years in Web
            Design and Development. I am also a Cyber Security specialist with
            more than 3 years of experience in the field.
          </p>
          <p className="mt-2">
            Specializing in WordPress, I craft responsive and captivating
            websites that empower my clients to outshine their competitors. My
            expertise lies in creating dynamic and user-friendly WordPress
            websites that seamlessly adapt across all devices. Let's collaborate
            to bring your web vision to life and elevate your online presence.
          </p>
        </div>
      </article>

      <article className="mt-4">
        <div className="text-gray-700">
          <p>
            Hello! I'm Mujtaba, an experienced Engineer and Certified Web
            Developer with a proven track record spanning over 5 years in Web
            Design and Development.
          </p>

          <div>
            <p className="mt-2">
              I am also a Cyber Security specialist with more than 3 years of
              experience in the field. Specializing in WordPress, I craft
              responsive and captivating websites that empower my clients to
              outshine their competitors. My expertise lies in creating dynamic
              and user-friendly WordPress websites that seamlessly adapt across
              all devices. Let's collaborate to bring your web vision to life
              and elevate your online presence.
            </p>
          </div>
        </div>
      </article>
    </div>
  );
};

export default GigSellerOverview;
