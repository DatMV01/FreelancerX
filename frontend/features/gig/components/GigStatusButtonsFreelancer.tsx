import React from "react";
import { GigStatus } from "../gig.types";
import { Eye, PauseCircle, Pencil, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  status: GigStatus;
  onViewDetails?: () => void;
  onPause?: () => void;
  onEdit?: () => void;
  onActive?: () => void;
  onDelete?: () => void;
};

const GigStatusButtonsFreelancer = ({
  status,
  onViewDetails,
  onPause,
  onEdit,
  onActive,
  onDelete,
}: Props) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={onViewDetails} variant="outline">
        <Eye className="h-4" /> View Details
      </Button>

      {status == GigStatus.ACTIVE && (
        <>
          <Button variant="outline" onClick={onPause}>
            <PauseCircle className="h-4 text-orange-500" />
            PAUSE
          </Button>

          <Button variant="outline" onClick={onEdit}>
            <Pencil className="h-4 text-green-500" /> Edit
          </Button>
        </>
      )}

      {status == GigStatus.DRAFT && (
        <>
          <Button variant="outline" onClick={onActive}>
            <Send className="h-4 text-green-500" /> Active
          </Button>

          <Button variant="outline" onClick={onEdit}>
            <Pencil className="h-4 text-green-500" /> Edit
          </Button>
        </>
      )}

      {status == GigStatus.PAUSED && (
        <>
          <Button variant="outline" onClick={onActive}>
            <Send className="h-4 text-green-500" /> Active
          </Button>

          <Button variant="outline" onClick={onEdit}>
            <Pencil className="h-4 text-green-500" /> Edit
          </Button>
        </>
      )}

      {false && status == GigStatus.REJECTED && (
        <>
          <Button variant="outline">
            <Send className="h-4 text-green-500" /> Submit for approval
          </Button>

          <Button variant="outline">
            <Pencil className="h-4 text-green-500" /> Edit
          </Button>
        </>
      )}

      <Button variant="outline" onClick={onDelete}>
        <X className="h-4 text-red-500" /> Delete
      </Button>
    </div>
  );
};

export default GigStatusButtonsFreelancer;
