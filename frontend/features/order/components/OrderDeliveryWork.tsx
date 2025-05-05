import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Download } from "lucide-react";
import React from "react";

interface DeliveryWork {
  createdAt: string;
  message: string;
  file?: {
    id: string;
    url: string;
    mimeType: string;
    provider: string;
  };
}

interface DeliveryWorkCardProps {
  delivery: DeliveryWork;
}

const RenderKeyValue = ({ k, v }: { k: string; v: any }) => {
  return (
    <p className="flex w-full flex-wrap items-center gap-x-1 text-sm">
      <span className="w-22 max-w-22">{k}</span>
      <span>:</span>
      {typeof v === "string" ? (
        <span className="text-muted-foreground">{v}</span>
      ) : (
        v
      )}
    </p>
  );
};

export const OrderDeliveryWork: React.FC<DeliveryWorkCardProps> = ({
  delivery,
}) => {
  if (!delivery) return;

  const deliveryDate = new Date(delivery.createdAt);
  const formattedDate = format(deliveryDate, "dd/MM/yyyy HH:mm");

  return (
    <div className="flex w-full flex-col gap-y-2 rounded-xs border p-2">
      <RenderKeyValue k="Date" v={formattedDate} />

      <RenderKeyValue
        k="Attachment"
        v={
          <a href={delivery?.file?.url}>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>

            <span className="text-muted-foreground ml-1 text-sm break-all">
              {decodeURIComponent(delivery?.file?.url.split("___").pop() || "")}
            </span>
          </a>
        }
      />

      <RenderKeyValue k="Message" v={delivery.message} />
    </div>
  );
};
