import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { axiosInstanceV1 } from "@/lib/axios/axiosInstance";
import { FileDown, FileIcon, Upload } from "lucide-react";
import useSWR, { mutate } from "swr";
import { OrderQuestionAnswers } from "./OrderQuestionAnswers";
import { CircularProgress } from "@mui/material";
import { getOrderById } from "../order.api";
import { OrderFreelancerStatusButton } from "./OrderFreelancerStatusButton";
import { OrderLogTimeline } from "./OrderLogTimeline";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useCallback, useState } from "react";
import { OrderStatus } from "../dto";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import DeliverWorkDialog from "./DeliverWorkDialog";
import StartWorkingDialog from "./StartWorkingDialog";
import CancelOrderDialog from "./CancelOrderDialog";
import { DeliveryWorkCard } from "./DeliveryWorkCard";
import { format } from "date-fns";
import { toast } from "sonner";
import AcceptlOrderDialog from "./AcceptlOrderDialog";
import AskQuestionDialog from "./AskQuestionDialog";
import { OrderBuyerStatusButton } from "./OrderBuyerStatusButton";
import RequestRevisionDialog from "./RequestRevisionDialog";
import CompleteOrderDialog from "./CompleteOrderDialog";
import { RatingOrderDialog } from "./RatingOrderDialog";

type OrderDetailBuyerProps = {
  orderId: any;
  mutateAllOrder?: any;
};

export const OrderDetailBuyer = ({
  orderId,
  mutateAllOrder,
}: OrderDetailBuyerProps) => {
  if (!orderId) return null;

  const {
    data: order,
    error,
    isLoading,
    isValidating,
    mutate: mutateThisOrder,
  } = useSWR(`/orders/${orderId}`, () => getOrderById(orderId), {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0,
    dedupingInterval: 0,
  });

  const [requestRevisionDialogOpen, setRequestRevisionDialogOpen] =
    useState(false);
  const [startWorkDialogOpen, setStartWorkDialogOpen] = useState(false);
  const [deliverWorkDialogOpen, setDeliverWorkDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [askQuestionDialogOpen, setAskQuestionDialogOpen] = useState(false);

  const [completeOrderDialogOpen, setCompleteOrderDialogOpen] = useState(false);

  const [ratingOrderDialogOpen, setRatingOrderDialogOpen] = useState(false);

  if (isLoading || isValidating) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <CircularProgress size={24} />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex items-center justify-center py-4 text-red-500">
        <p>Order is not found.</p>
      </div>
    );
  }

  const sortedDeliverables = [...order.deliverables].sort(
    (a: any, b: any) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <div className="flex h-[96%] flex-col gap-2 p-2">
      <div className="h-full flex-1">
        <div className="flex h-full gap-4">
          <div className="flex-1 overflow-x-hidden overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-lg font-semibold text-blue-900">
                  Order #{order.id.split("-")[4]}
                </p>

                <p className="text-muted-foreground text-sm">
                  <span>Created At: </span>
                  {format(new Date(order.createdAt), "dd/MM/yyyy HH:mm")}
                </p>
                <p className="text-muted-foreground text-sm">
                  <span>Start At: </span>

                  {order.startDate
                    ? format(new Date(order.startDate), "dd/MM/yyyy HH:mm")
                    : "N/A"}
                </p>
                <p className="text-muted-foreground text-sm">
                  <span>Deadline: </span>
                  {order.endDate
                    ? format(new Date(order.endDate), "dd/MM/yyyy")
                    : "N/A"}
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
                    Email:
                    <a href="#"> {order.snapshot.buyer.email}</a>
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
                    Email:
                    <a href="#"> {order.snapshot.freelancer.email}</a>
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Order content */}
            <div>
              <p className="font-bold">Order Detail</p>

              <p>
                <span className="text-muted-foreground text-sm">Total:</span>

                {order.totalAmount}
              </p>
              <p>
                <span className="text-muted-foreground text-sm">Gig:</span>

                <a href="#"> {`${order.snapshot.gig.title} `}</a>
              </p>

              <p>
                <span className="text-muted-foreground text-sm">Package:</span>

                {`${order.snapshot.package.title} - ${order.snapshot.package.type}`}
              </p>

              <p>
                <span className="text-muted-foreground text-sm">
                  Description:
                </span>

                {order.snapshot.package.description}
              </p>

              <p>
                <span className="text-muted-foreground text-sm">
                  Delivery Days:
                </span>

                {order.deliveryTime}
              </p>

              <p>
                <span className="text-muted-foreground text-sm">
                  Revisions:
                </span>

                {order.snapshot.package.revisions}
              </p>
            </div>

            <Separator />

            <p className="font-bold"> Deliverables</p>

            <div className="flex flex-col gap-y-1">
              {sortedDeliverables?.map((item: any) => (
                <DeliveryWorkCard key={item.id} delivery={item} />
              ))}
            </div>
          </div>

          <div className="flex-1">
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

                if (status === 200) {
                  mutateThisOrder();
                }
              }}
            />
          </div>

          {/* <div className="flex-1 overflow-y-auto">
            <OrderLogTimeline logs={order.orderlogs} />
          </div> */}
        </div>
      </div>

      <div className="flex justify-center">
        <OrderBuyerStatusButton
          status={order.status}
          onViewDetails={() => {}}
          onPay={() => {
            // toast.info("onPay");

            window.open(
              `/payment/checkout${order.snapshot.paymentUrl}`,
              "_blank",
            );
          }}
          onCancel={() => {
            //  toast.info("onCancel");
            setCancelDialogOpen(true);
          }}
          onComplete={() => {
            // toast.info("onComplete");
            setCompleteOrderDialogOpen(true);
          }}
          onRate={() => {
            setRatingOrderDialogOpen(true);
          }}
          onRequestRevision={() => {
            //   toast.info("onRequestRevision");
            setRequestRevisionDialogOpen(true);
          }}
        />
      </div>
      <RequestRevisionDialog
        open={requestRevisionDialogOpen}
        onOpenChange={setRequestRevisionDialogOpen}
        handleRequestRevision={async () => {
          const response = await axiosInstanceV1.patch(`/orders/${order.id}`, {
            status: OrderStatus.REVISION_REQUESTED,
          });

          if (response.status === 200) {
            mutateThisOrder();
            mutateAllOrder && mutateAllOrder();
          }

          setRequestRevisionDialogOpen(false);
        }}
      />

      <RatingOrderDialog
        open={ratingOrderDialogOpen}
        onOpenChange={setRatingOrderDialogOpen}
        orderId="12345"
        handleSubmit={({ rating, review }) => {
          toast.info("Đánh giá:" + rating + "Nội dung:" + review);

          setRatingOrderDialogOpen(false);
        }}
      />

      <CompleteOrderDialog
        open={completeOrderDialogOpen}
        onOpenChange={setCompleteOrderDialogOpen}
        handleCompleteOrder={async () => {
          const response = await axiosInstanceV1.patch(`/orders/${order.id}`, {
            status: OrderStatus.COMPLETED,
          });

          if (response.status === 200) {
            mutateThisOrder();
            mutateAllOrder && mutateAllOrder();
          }

          setCompleteOrderDialogOpen(false);
        }}
      />

      <StartWorkingDialog
        open={startWorkDialogOpen}
        onOpenChange={setStartWorkDialogOpen}
        handleStartWorkOrder={async () => {
          try {
            const response = await axiosInstanceV1.patch(
              `/orders/${order.id}`,
              {
                status: OrderStatus.IN_PROGRESS,
                startDate: new Date(Date.now()),
                action: "ACCEPT_ORDER",
              },
            );

            if (response.status === 200) {
              mutateThisOrder();
              mutateAllOrder && mutateAllOrder();
            }
          } catch (error) {
            toast.info(error as any);
          } finally {
            setStartWorkDialogOpen(false);
          }
        }}
      />
      <CancelOrderDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        handleCancelOrder={async () => {
          const response = await axiosInstanceV1.patch(`/orders/${order.id}`, {
            status: OrderStatus.CANCEL,
          });

          if (response.status === 200) {
            mutateThisOrder();
            mutateAllOrder && mutateAllOrder();
          }

          setCancelDialogOpen(false);
        }}
      />
      <AskQuestionDialog
        open={askQuestionDialogOpen}
        onOpenChange={setAskQuestionDialogOpen}
        handleAskQuestion={async (question) => {
          const formData = new FormData();
          formData.append("question", question);
          formData.append("orderId", orderId);

          const response = await axiosInstanceV1.post(
            "/orders/questions-answers",
            formData,
          );

          if (response.status === 201) {
            mutateThisOrder();
          }

          setAskQuestionDialogOpen(false);
        }}
      />
      <DeliverWorkDialog
        open={deliverWorkDialogOpen}
        onOpenChange={setDeliverWorkDialogOpen}
        onSubmit={async ({ message, file }) => {
          const formData = new FormData();
          formData.append("message", message);
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
            `/orders/delivery`,
            formData,
          );

          if (status === 201) {
            mutateThisOrder();
            mutateAllOrder && mutateAllOrder();
          }

          setDeliverWorkDialogOpen(false);
        }}
      />
    </div>
  );
};
