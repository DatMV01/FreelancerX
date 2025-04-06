import { GigDto } from "@/dto/dto.type.";
import { Check } from "lucide-react";
import React from "react";

interface RowData {
  id: number | string;
  package: string;
  basic: string;
  standard: string;
  premium: string;
}
const transformValue = (value: any) => {
  if (String(value).toLowerCase() === "x") {
    return <Check size={16} className="text-green-500" />;
  } else if (String(value).toLowerCase() === "") {
    return "-";
  } else {
    return value;
  }
};

const GigComparePackage = ({ gig }: { gig: GigDto }) => {
  const packages: RowData[] =
    gig?.pricingPackage?.filter((_) => {
      return _.package !== "Name" && _.package !== "Description";
    }) || [];
debugger
  const [delivery, revision, price, ...addtitionalPackages] = packages;

  const headers = ["Feature", "Basic", "Standard", "Premium"];
  const requiredFeatures = [
    {
      name: `${price.package}`,
      values: [price.basic, price.standard, price.premium],
    },
    {
      name: `${delivery.package}`,
      values: [delivery.basic, delivery.standard, delivery.premium],
    },
    {
      name: `${revision.package}`,
      values: [revision.basic, revision.standard, revision.premium],
    },
  ];

  const addtionalFeatures = addtitionalPackages.map((_) => {
    return {
      name: `${_.package}`,
      values: [_.basic, _.standard, _.premium],
    };
  });

  return (
    <div id="compare-packages" className="my-4">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            {headers.map((header, index) => (
              <th key={index} className="border p-3">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {requiredFeatures.map((feature, index) => (
            <tr key={index} className="text-center">
              <td className="border p-3 font-bold">{feature.name}</td>
              {feature.values.map((value, i) => (
                <td key={i} className="w-1/3 break-words border">
                  {value}
                </td>
              ))}
            </tr>
          ))}
          {addtionalFeatures.map((feature, index) => (
            <tr key={index} className="text-center">
              <td className="border p-3 font-bold">{feature.name}</td>
              {feature.values.map((value, i) => (
                <td key={i} className="w-1/3 break-words border">
                  <div className="flex h-full items-center justify-center">
                    {transformValue(value)}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GigComparePackage;
