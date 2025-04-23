import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { axiosInstanceV1 } from "@/lib/axios/axiosInstance";
import { CircularProgress } from "@mui/material";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import { OrderActions } from "../dto";
import {
  getOrderById,
  getOrderReviewById,
  updateOrderByAction,
} from "../order.api";
import { OrderBuyerStatusButton } from "./OrderBuyerStatusButton";
import OrderCancelDialog from "./OrderCancelDialog";
import OrderCompleteDialog from "./OrderCompleteDialog";
import { OrderDeliveryWork } from "./OrderDeliveryWork";
import { OrderLogTimeline } from "./OrderLogTimeline";
import { OrderQuestionAnswers } from "./OrderQuestionAnswers";
import { OrderRatingDialog } from "./OrderRatingDialog";
import OrderReview from "./OrderReview";
import OrderRequestRevisionDialog from "./OrderRequestRevisionDialog";

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

  const { data: review, mutate: mutateReview } = useSWR(
    `reviews/order/${orderId}`,
    () => getOrderReviewById(orderId),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
      dedupingInterval: 0,
    },
  );

  const [requestRevisionDialogOpen, setRequestRevisionDialogOpen] =
    useState(false);
  const [startWorkDialogOpen, setStartWorkDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [completeOrderDialogOpen, setCompleteOrderDialogOpen] = useState(false);
  const [ratingOrderDialogOpen, setRatingOrderDialogOpen] = useState(false);

  const [processing, setProcessing] = useState(false);

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
                    ? format(new Date(order.startDate), "dd/MM/yyyy")
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
                <OrderDeliveryWork key={item.id} delivery={item} />
              ))}
            </div>

            <p className="font-bold"> Review</p>
            {review && <OrderReview review={review} />}
          </div>

          <div className="flex-1">
            <OrderQuestionAnswers
              items={order.orderQuestionsAnswers}
              isBuyer
              onSubmitAnswer={async (id, answer, file) => {
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

          <div className="flex-1 overflow-y-auto">
            <OrderLogTimeline logs={order.orderlogs} />
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <OrderBuyerStatusButton
          status={order.status}
          showRevisionButton={
            order.snapshot.package.revisions + 1 > order.deliverables.length
          }
          showRateButton={!review || review.length === 0}
          onViewDetails={() => {}}
          onPay={() => {
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

      <OrderRequestRevisionDialog
        open={requestRevisionDialogOpen}
        processing={processing}
        onOpenChange={setRequestRevisionDialogOpen}
        handleRequestRevision={async () => {
          setProcessing(true);

          try {
            const response = await updateOrderByAction(
              order.id,
              OrderActions.REQUEST_REVISION.action,
            );

            if (response.status === 200) {
              mutateThisOrder();
              mutateAllOrder && mutateAllOrder();
            }
          } catch (error) {
            toast.error("RequestRevisionDialog Error");
          } finally {
            setRequestRevisionDialogOpen(false);
            setProcessing(false);
          }
        }}
      />

      <OrderCompleteDialog
        open={completeOrderDialogOpen}
        processing={processing}
        onOpenChange={setCompleteOrderDialogOpen}
        handleCompleteOrder={async () => {
          setProcessing(true);

          try {
            const response = await updateOrderByAction(
              order.id,
              OrderActions.COMPLETE_ORDER.action,
            );

            if (response.status === 200) {
              mutateThisOrder();
              mutateAllOrder && mutateAllOrder();
            }
          } catch (error) {
            toast.error("OrderCompleteDialog Error");
          } finally {
            setCompleteOrderDialogOpen(false);
            setProcessing(false);
          }
        }}
      />

      <OrderRatingDialog
        open={ratingOrderDialogOpen}
        processing={processing}
        onOpenChange={setRatingOrderDialogOpen}
        orderId={order.id.split("-")[4]}
        handleSubmit={async ({ rating, review }) => {
          setProcessing(true);

          try {
            const response = await axiosInstanceV1.post(`/reviews`, {
              gigId: order.gigId,
              orderId,
              rating,
              comment: review,
            });

            if (response.status === 201) {
              mutateReview();
            }
          } catch (error) {
            toast.error("OrderRatingDialog Error");
          } finally {
            setProcessing(false);
            setRatingOrderDialogOpen(false);
          }
        }}
      />

      <OrderCancelDialog
        open={cancelDialogOpen}
        processing={processing}
        onOpenChange={setCancelDialogOpen}
        handleCancelOrder={async () => {
          setProcessing(true);

          try {
            const response = await updateOrderByAction(
              order.id,
              OrderActions.CANCEL_ORDER_BUYER.action,
            );

            if (response.status === 200) {
              mutateThisOrder();
              mutateAllOrder && mutateAllOrder();
            }
          } catch (error) {
            toast.error("CancelOrderDialog Error");
          } finally {
            setProcessing(false);
            setCancelDialogOpen(false);
          }
        }}
      />
    </div>
  );
};
