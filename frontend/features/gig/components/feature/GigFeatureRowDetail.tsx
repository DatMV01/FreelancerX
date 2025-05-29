import { Button } from "@/components/ui/button";
import { GigForm } from "@/pages/dashboard/freelancer/gigs/new";
import { CheckCircle, Pencil, Trash2, X } from "lucide-react";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  GigFeatureRowCreateUpdate,
  FeatureRowType,
} from "./GigFeatureRowCreateUpdate";
import { FeatureRow } from "../GigPricingInput";

interface Props {
  feature: FeatureRowType;
  index: number;
  form: UseFormReturn<GigForm>;
  onUpdate: (featureRow: FeatureRowType) => void;
  onRemove: (id: string) => void;
}

const transformValue = (value: any) => {
  if (value.toLowerCase() === "x" || value.toLowerCase() === "yes") {
    return <CheckCircle size={18} className="text-green-500" />;
  } else if (value.toLowerCase() === "") {
    return <X color="red" size={18} />;
  } else {
    return value;
  }
};

export const GigFeatureRowDetail = ({
  feature,
  index,
  onUpdate,
  onRemove,
}: Props) => {
  const [isEditing, setEditing] = useState(false);

  const handleUpdate = (feature: FeatureRowType) => {
    onUpdate(feature);
    setEditing(false);
  };

  if (isEditing)
    return (
      <GigFeatureRowCreateUpdate
        index={index}
        feature={feature}
        onUpdate={handleUpdate}
      />
    );

  return (
    <FeatureRow
      noColumn={index + 1}
      featureColumn={feature.feature}
      basicColumn={transformValue(feature.basic)}
      standardColumn={transformValue(feature.standard)}
      premiumColumn={transformValue(feature.premium)}
      actionColumn={
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();

              setEditing(true);
            }}
          >
            <Pencil className="text-blue-500 hover:text-blue-700" size={16} />
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log(feature);
              onRemove(feature.id);
            }}
          >
            <Trash2 size={16} />
          </Button>
        </>
      }
    />
  );
};
