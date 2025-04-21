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

export const DeliveryWorkCard: React.FC<DeliveryWorkCardProps> = ({
  delivery,
}) => {
  const formattedDate = format(
    new Date(delivery.createdAt),
    "dd/MM/yyyy HH:mm ",
  );

  return (
    <div className="w-full rounded-sm border px-2 py-2">
      <div className="flex w-full items-center gap-x-2 overflow-x-hidden">
        <div className="text-muted-foreground w-[80px] text-center text-sm">
          {formattedDate}
        </div>

        {delivery.file && (
          <div className="bg-muted flex flex-1 items-center justify-between gap-x-2 rounded-sm px-2 py-2">
            <a href={delivery.file.url} className="w-fit" download>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </a>

            <div className="truncate text-sm">
              {decodeURIComponent(delivery.file.url.split("___").pop() || "")}
            </div>
          </div>
        )}
      </div>

      <div className="px-2 break-all">{delivery.message}</div>
    </div>
  );
};
