import React from "react";
import { GigStatus } from "../gig.types";
import { Ban, Eye, PauseCircle, Pencil, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  status: GigStatus;
  onViewDetails?: () => void;
  onPause?: () => void;
  onEdit?: () => void;
  onActive?: () => void;
  onDelete?: () => void;
  onReject?: () => void;
};

const GigStatusButtonsAdmin = ({
  status,
  onViewDetails,
  onPause,
  onEdit,
  onActive,
  onDelete,
  onReject,
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

      {true && status == GigStatus.REJECTED && (
        <>
          <Button variant="outline" onClick={onActive}>
            <Send className="h-4 text-green-500" /> Active
          </Button>
        </>
      )}

      {status !== GigStatus.REJECTED && (
        <Button variant="outline" onClick={onReject}>
          <Ban className="h-4 text-red-500" /> Reject
        </Button>
      )}

      <Button variant="outline" onClick={onDelete}>
        <X className="h-4 text-red-500" /> Delete
      </Button>
    </div>
  );
};

export default GigStatusButtonsAdmin;
