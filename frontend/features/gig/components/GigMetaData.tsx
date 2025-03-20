import React from "react";

const GigMetaData = () => {
  const websiteFeatures = [
    "Marketing",
    "Payment",
    "Shipping",
    "Analytics",
    "Form",
    "Events",
    "Chat",
    "Membership",
    "Gallery",
    "Booking",
  ];

  const plugins = [
    "Adsense",
    "Akismet",
    "All-in-one SEO pack",
    "Contact form 7",
    "Facebook",
    "GetResponse",
    "Gravity Forms",
    "Instagram",
    "LinkedIn",
    "Mailchimp",
    "Paypal",
    "Twitter",
    "W3 Total Cache",
    "WooCommerce",
    "WordPress SEO by Yoast",
    "Elementor",
    "Other",
  ];

  return (
    <div className="py-6">
      <div className="flex flex-col md:flex-row md:justify-between">
        <div className="md:mb-0 md:w-1/2">
          <h2 className="text-lg font-bold">Website Type</h2>
          <p className="text-gray-600">Business</p>
        </div>

        <div className="md:mb-0 md:w-1/2">
          <h3 className="text-md mb-2 font-semibold">Website Features</h3>
          <ul className="list-disc pl-5 text-gray-700">
            {websiteFeatures.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
        <div className="md:w-1/2">
          <h3 className="text-md mb-2 font-semibold">Plugins</h3>
          <ul className="list-disc pl-5 text-gray-700">
            {plugins.map((plugin, index) => (
              <li key={index}>{plugin}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GigMetaData;
