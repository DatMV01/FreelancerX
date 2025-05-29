import { GigDto, GigPackage } from "@/dto/dto.type.";
import { CheckCircle, Clock, DollarSign, RefreshCw, X } from "lucide-react";

const GigComparePackage2 = ({ gig }: { gig: GigDto }) => {
  const orderedTypes = ["basic", "standard", "premium"];
  
  const sortedPackages: GigPackage[] = orderedTypes.map((type) =>
    gig.packages.find((p) => p.type === type),
  ) as any;

  const allFeatureNames = sortedPackages.flatMap((pkg) =>
    pkg.features.map((f) => f.name),
  );

  const allFeatures = Array.from(new Set(allFeatureNames));

  const getValue = (pkg: GigPackage, feature: string) => {
    const found = pkg.features.find((f) => f.name === feature);
    if (found?.value) {
      if (found.value === "Yes" || found.value === "x" || found.value === "X") {
        return <CheckCircle className="text-green-500" size={18} />;
      }
      return found.value;
    }
    return <X color="red" size={18} />;
  };

  const getPackageTitle = (type: string) => {
    return sortedPackages.find((p) => p.type === type)?.title || type;
  };

  return (
    <div id="compare-packages" className="w-full rounded-sm border">
      <table className="min-w-full table-fixed text-sm">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-2">Features</th>
            {sortedPackages.map((pkg) => (
              <th
                key={pkg.type}
                className="w-1/4 border px-4 py-2 text-center capitalize"
              >
                {getPackageTitle(pkg.type)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {allFeatures.map((feature) => (
            <tr key={feature} className="border-t">
              <td className="px-4 py-2 font-medium">{feature}</td>
              {sortedPackages.map((pkg) => (
                <td key={pkg.type} className="border px-4 py-2">
                  <span className="flex items-center justify-center">
                    {getValue(pkg, feature)}
                  </span>
                </td>
              ))}
            </tr>
          ))}
          <tr className="border-t bg-gray-50 font-semibold">
            <td className="px-4 py-2">
              <span className="flex items-center space-x-1">
                <RefreshCw size={18} className="text-green-500" />
                <span>Revision</span>
              </span>
            </td>
            {sortedPackages.map((pkg) => (
              <td key={pkg.type} className="px-4 py-2 text-center">
                {pkg.revisions}
              </td>
            ))}
          </tr>
          <tr className="border-t bg-gray-50 font-semibold">
            <td className="px-4 py-2">
              <span className="flex items-center space-x-1">
                <Clock size={18} className="text-orange-500" />
                <span>Delivery (Days)</span>
              </span>
            </td>
            {sortedPackages.map((pkg) => (
              <td key={pkg.type} className="px-4 py-2 text-center">
                {pkg.deliveryTime}
              </td>
            ))}
          </tr>
          <tr className="border-t bg-gray-50 font-semibold">
            <td className="px-4 py-2">
              <span className="flex items-center space-x-1">
                <DollarSign size={18} className="text-blue-500" />
                <span>Price (USD)</span>
              </span>
            </td>
            {sortedPackages.map((pkg) => (
              <td key={pkg.type} className="px-4 py-2 text-center">
                ${pkg.price}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default GigComparePackage2;
