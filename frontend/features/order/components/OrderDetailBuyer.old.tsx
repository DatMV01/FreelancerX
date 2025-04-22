import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

import { MessageSquare, FileDown } from "lucide-react";
import { OrderBuyerStatusButton } from "./OrderBuyerStatusButton";
import { OrderStatus } from "../dto";
import { OrderStatusTimeline } from "./OrderStatusTimeline";
import { OrderQuestionAnswers } from "./OrderQuestionAnswers";
import { axiosInstanceV1 } from "@/lib/axios/axiosInstance";
import useSWR, { mutate } from "swr";
import { getOrderById } from "../order.api";

type OrderDetailBuyerProps = {
  order: any;
  mutate?: () => void;
  onCancel?: () => void;
  onAccept?: () => void;
  onRequestRevision?: () => void;
  onDownload?: () => void;
  onMessage?: () => void;
  onRate?: () => void;
};

export const OrderDetailBuyer = ({
  order,

  onCancel,
  onAccept,
  onRequestRevision,
  onDownload,
  onMessage,
  onRate,
}: OrderDetailBuyerProps) => {
  if (!order) {
    return (
      <div className="flex items-center justify-center py-4">
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    );
  }

  const orderId = order.id;

  //   order.orderQuestionsAnswers = Array.from({ length: 20 }, (_, i) => ({
  //     createdAt: "2025-04-19T09:42:48.336Z",
  //     updatedAt: "2025-04-19T09:42:48.336Z",
  //     id: i,
  //     orderId: "09ef5b2b-7e08-41a8-8eee-953c967977e4",
  //     question: "Do you have an idea of what you want?",
  //     answer: "ok123",
  //     file: {
  //       id: "1c06ce6e-3d8f-47f4-9a65-69cb4e6bf8e7",
  //       url: "http://localhost:3000/public/avatars/order___09ef5b2b-7e08-41a8-8eee-953c967977e4___ventoy-1.1.05-windows-1745055764091-f20de940c82a1c8335820.zip",
  //       mimeType: "application/x-zip-compressed",
  //       provider: "local",
  //     },
  //   }));

  return (
    <div className="flex h-[80vh] gap-4">
      <div className="flex-1 space-y-2">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              Order #{order.id.split("-")[4]}
            </h2>
            <p className="text-muted-foreground text-sm">
              Create Date: {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <Badge variant="outline" className="uppercase">
            {order.status.replace("_", " ")}
          </Badge>
        </div>

        <Separator />

        {/* Freelancer info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <p className="font-bold">Buyer</p>
              <p className="text-muted-foreground text-sm">
                Name: {order.snapshot.buyer.fullName}
              </p>
              <p className="text-muted-foreground text-sm">
                Email: {order.snapshot.buyer.email}
              </p>
            </div>
          </div>

          {/* Freelancer info */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <p className="font-bold">Freelancer</p>

              <p className="text-muted-foreground text-sm">
                Name: {order.snapshot.freelancer.displayName}
              </p>
              <p className="text-muted-foreground text-sm">
                Email: {order.snapshot.freelancer.email}
              </p>
            </div>
          </div>
        </div>
        <Separator />
        {/* Order content */}
        <div>
          <h3 className="text-xl font-semibold">Order Detail</h3>
          <p className="text-muted-foreground">{order.description}</p>
          <div className="mt-2 space-y-1">
            <p>
              Package:{" "}
              <strong>{`${order.snapshot.package.title} - ${order.snapshot.package.type}`}</strong>
            </p>
            <p>Price: {order.price}</p>
            {order.startDate && (
              <p>
                Start date: {new Date(order.startDate).toLocaleDateString()}
              </p>
            )}

            {order.endDate && (
              <p>
                End date: {new Date(order.endDate).toLocaleDateString()}
              </p>
            )}

 
            {order.attachmentUrl && (
              <Button
                variant="ghost"
                onClick={() => window.open(order.attachmentUrl, "_blank")}
              >
                <FileDown className="mr-2 h-4 w-4" />
                Xem file đính kèm
              </Button>
            )}
          </div>
        </div>

        {/* Delivery */}
        {order.deliveryUrl && (
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold">Sản phẩm bàn giao</h3>
            <Button
              onClick={() => window.open(order.deliveryUrl, "_blank")}
              variant="default"
            >
              <FileDown className="mr-2 h-4 w-4" />
              Tải về
            </Button>
          </div>
        )}

        {/* Actions */}
      </div>

      <div className="h-full flex-1">
        <OrderQuestionAnswers
          items={order.orderQuestionsAnswers}
          isBuyer
          onSubmitAnswer={async (id, answer, file) => {
            // API gửi câu trả lời của buyer
            console.log("id", id);
            console.log("answer", answer);
            console.log("file", file);

            const formData = new FormData();
            formData.append("id", id);
            formData.append("orderId", orderId);
            formData.append("answer", answer);

            if (file) {
              const newFileName = `order___${orderId}___${file.name.replaceAll(" ", "_")}`;
              const newFile = new File([file], newFileName, {
                type: file.type,
              });

              const fileForm = new FormData();
              fileForm.append("file", newFile);

              const { data, status } = await axiosInstanceV1.post(
                "/file/upload",
                fileForm,
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                },
              );

              if (status === 201) {
                console.log("File uploaded successfully", data);
                formData.append("file", JSON.stringify(data));
              }
            }
            console.log(formData);

            const { data, status } = await axiosInstanceV1.patch(
              `/orders/questions-answers/${id}`,
              formData,
            );

            if (status === 201) {
              mutate(`/orders/${orderId}`);
            }
          }}
          onAddQuestion={async (question, file) => {
            console.log("question", question);
            console.log("file", file);

            const formData = new FormData();
            formData.append("question", question);
            formData.append("orderId", orderId);

            if (file) {
              const newFileName = `order___${orderId}___${file.name.replaceAll(" ", "_")}`;
              const newFile = new File([file], newFileName, {
                type: file.type,
              });

              const fileForm = new FormData();
              fileForm.append("file", newFile);

              const { data, status } = await axiosInstanceV1.post(
                "/file/upload",
                fileForm,
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                },
              );

              if (status === 201) {
                console.log("File uploaded successfully", data);
                formData.append("file", JSON.stringify(data));
              }
            }

            const { data, status } = await axiosInstanceV1.post(
              "/orders/questions-answers",
              formData,
            );

            if (status === 201) {
              mutate(`/orders/${orderId}`);
            }
          }}
        />
      </div>
    </div>
  );
};
