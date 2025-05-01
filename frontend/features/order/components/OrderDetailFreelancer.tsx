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
import OrderAcceptDialog from "./OrderAcceptDialog";
import OrderAskQuestionDialog from "./OrderAskQuestionDialog";
import OrderCancelDialog from "./OrderCancelDialog";
import { OrderDeliveryWork } from "./OrderDeliveryWork";
import OrderDeliverWorkDialog from "./OrderDeliverWorkDialog";
import { OrderStatusButtonFreelancer } from "./OrderStatusButtonFreelancer";
import { OrderLogTimeline } from "./OrderLogTimeline";
import { OrderQuestionAnswers } from "./OrderQuestionAnswers";
import OrderReview from "./OrderReview";
import StartWorkingDialog from "./StartWorkingDialog";

type OrderDetailBuyerProps = {
  orderId: any;
  mutateAllOrder?: any;
};

export const OrderDetailFreelancer = ({
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

  const { data: review, mutate: mutetateReview } = useSWR(
    `reviews/order/${orderId}`,
    () => getOrderReviewById(orderId),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
      dedupingInterval: 0,
    },
  );

  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [startWorkDialogOpen, setStartWorkDialogOpen] = useState(false);
  const [deliverWorkDialogOpen, setDeliverWorkDialogOpen] = useState(false);

  const [reDeliverWorkDialogOpen, setReDeliverWorkDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [askQuestionDialogOpen, setAskQuestionDialogOpen] = useState(false);

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
                <OrderDeliveryWork key={item.id} delivery={item} />
              ))}
            </div>

            <p className="font-bold"> Review</p>

            {review && (
              <OrderReview
                review={review}
                isFreelancer
                onReplySubmit={async (reviewId, replyText) => {
                  console.log(review);

                  try {
                    const response = await axiosInstanceV1.patch(
                      `/reviews/${reviewId}`,
                      {
                        reply: replyText,
                        freelancerId: order.freelancerId,
                      },
                    );

                    if (response.status === 200) {
                      mutetateReview();
                    }
                  } catch (error: any) {
                    toast.error("error");
                  } finally {
                  }
                }}
              />
            )}
          </div>

          <div className="flex-1">
            <OrderQuestionAnswers
              items={order.orderQuestionsAnswers}
              onAddQuestion={async (question, file) => {
                const formData = new FormData();
                formData.append("question", question);
                formData.append("orderId", orderId);

                if (file) {
                  const newFileName = `order___${orderId}___${file.name.replaceAll(" ", "_")}`;
                  const newFile = new File([file], newFileName, {
                    type: file.type,
                  });

                  const { data, status } = await axiosInstanceV1.post(
                    "/file/upload",
                    { file: newFile },
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
                  //mutate(`/orders/${orderId}`);
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
        <OrderStatusButtonFreelancer
          status={order.status}
          onViewDetails={() => {}}
          onAccept={() => {
            setAcceptDialogOpen(true);
          }}
          onStart={() => {
            setStartWorkDialogOpen(true);
          }}
          onCancel={() => {
            setCancelDialogOpen(true);
          }}
          onDeliver={() => {
            setDeliverWorkDialogOpen(true);
          }}
          onAskQuestion={() => {
            setAskQuestionDialogOpen(true);
          }}
          onReDeliver={() => {
            setReDeliverWorkDialogOpen(true);
          }}
          onRefresh={() => {
            mutateThisOrder();
          }}
        />
      </div>

      <OrderAcceptDialog
        open={acceptDialogOpen}
        onOpenChange={setAcceptDialogOpen}
        handleAcceptOrder={async () => {
          setProcessing(true);

          try {
            const response = await updateOrderByAction(
              order.id,
              OrderActions.ACCEPT_ORDER.action,
            );

            if (response.status === 200) {
              //mutateThisOrder(response.data, false);
              mutateThisOrder();
              mutateAllOrder && mutateAllOrder();
            }
          } catch (error) {
            toast.error("AcceptlOrderDialog Error");
          } finally {
            setAcceptDialogOpen(false);
            setProcessing(false);
          }
        }}
      />

      <StartWorkingDialog
        open={startWorkDialogOpen}
        processing={processing}
        onOpenChange={setStartWorkDialogOpen}
        handleStartWorkOrder={async () => {
          setProcessing(true);

          try {
            const response = await updateOrderByAction(
              order.id,
              OrderActions.START_WORK.action,
            );

            if (response.status === 200) {
              mutateThisOrder();
              mutateAllOrder && mutateAllOrder();
            }
          } catch (error) {
            toast.error("StartWorkingDialog Error");
          } finally {
            setStartWorkDialogOpen(false);
            setProcessing(false);
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
              OrderActions.CANCEL_ORDER_FREELANCER.action,
            );

            if (response.status === 200) {
              mutateThisOrder();
              mutateAllOrder && mutateAllOrder();
            }
          } catch (error) {
            toast.error("CancelOrderDialog Error");
          } finally {
            setCancelDialogOpen(false);
            setProcessing(false);
          }
        }}
      />

      <OrderAskQuestionDialog
        open={askQuestionDialogOpen}
        processing={processing}
        onOpenChange={setAskQuestionDialogOpen}
        handleAskQuestion={async (question) => {
          setProcessing(true);

          try {
            const response = await axiosInstanceV1.post(
              "/orders/questions-answers",
              {
                question,
                orderId,
              },
            );

            if (response.status === 201) {
              mutateThisOrder();
            }
          } catch (error) {
            toast.error("StartWorkingDialog Error");
          } finally {
            setAskQuestionDialogOpen(false);
            setProcessing(false);
          }
        }}
      />

      <OrderDeliverWorkDialog
        open={deliverWorkDialogOpen}
        processing={processing}
        onOpenChange={setDeliverWorkDialogOpen}
        onSubmit={async ({ message, file }) => {
          setProcessing(true);

          const formData = new FormData();
          formData.append("message", message);
          formData.append("orderId", orderId);

          try {
            if (file) {
              const newFileName = `order___${orderId}___${file.name.replaceAll(" ", "_")}`;
              const newFile = new File([file], newFileName, {
                type: file.type,
              });

              const fileResponse = await axiosInstanceV1.post(
                "/file/upload",
                { file: newFile },
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                },
              );

              if (fileResponse.status === 201) {
                console.log("File uploaded successfully", fileResponse.data);
                formData.append("file", JSON.stringify(fileResponse.data));
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
          } catch (error) {
            toast.error("OrderDeliverWorkDialog Error");
          } finally {
            setDeliverWorkDialogOpen(false);
            setProcessing(false);
          }
        }}
      />

      <OrderDeliverWorkDialog
        open={reDeliverWorkDialogOpen}
        processing={processing}
        onOpenChange={setReDeliverWorkDialogOpen}
        onSubmit={async ({ message, file }) => {
          setProcessing(true);

          const formData = new FormData();
          formData.append("message", message);
          formData.append("orderId", orderId);

          try {
            if (file) {
              const newFileName = `order___${orderId}___${file.name.replaceAll(" ", "_")}`;
              const newFile = new File([file], newFileName, {
                type: file.type,
              });

              const fileResponse = await axiosInstanceV1.post(
                "/file/upload",
                { file: newFile },
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                },
              );

              if (fileResponse.status === 201) {
                console.log("File uploaded successfully", fileResponse.data);
                formData.append("file", JSON.stringify(fileResponse.data));
              }
            }

            const { data, status } = await axiosInstanceV1.post(
              `/orders/re-delivery`,
              formData,
            );

            if (status === 201) {
              mutateThisOrder();
              mutateAllOrder && mutateAllOrder();
            }
          } catch (error) {
            toast.error("ReOrderDeliverWorkDialog Error");
          } finally {
            setReDeliverWorkDialogOpen(false);
            setProcessing(false);
          }
        }}
      />
    </div>
  );
};
