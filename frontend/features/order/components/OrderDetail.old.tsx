import { Separator } from "@/components/ui/separator";

import { axiosInstanceV1 } from "@/lib/axios/axiosInstance";
import { CircularProgress } from "@mui/material";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import { ActorType, OrderActions, OrderActorType } from "../dto";
import {
  addOrderQuestion,
  getOrderById,
  getOrderReviewById,
  submitOrderAnswer,
  updateOrderByAction,
} from "../order.api";
import { OrderEntity } from "../order.entity";
import OrderCancelDialog from "./OrderCancelDialog";
import OrderCompleteDialog from "./OrderCompleteDialog";
import { OrderDeliveryWork } from "./OrderDeliveryWork";
import { OrderLogTimeline } from "./OrderLogTimeline";
import { OrderQuestionAnswers } from "./OrderQuestionAnswers";
import { OrderRatingDialog } from "./OrderRatingDialog";
import OrderRequestRevisionDialog from "./OrderRequestRevisionDialog";
import OrderReview from "./OrderReview";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { OrderStatusButtonBuyer } from "./OrderStatusButtonBuyer";
import CircularProgressCenter from "@/components/CircularProgressCenter";
import { ErrorOrEmptyState } from "@/components/ErrorOrEmptyState";
import OrderOverView from "./OrderOverView";
import { OrderStatusButtonFreelancer } from "./OrderStatusButtonFreelancer";
import StartWorkingDialog from "./StartWorkingDialog";
import OrderAcceptDialog from "./OrderAcceptDialog";
import OrderAskQuestionDialog from "./OrderAskQuestionDialog";
import OrderDeliverWorkDialog from "./OrderDeliverWorkDialog";
import { OrderStatusButtonAdmin } from "./OrderStatusButtonAdmin";

type OrderDetailBuyerProps = {
  orderId: any;
  mutateAllOrder?: any;
  actorType: ActorType;
};

export const OrderDetail = ({
  orderId,
  mutateAllOrder,
  actorType,
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
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [completeOrderDialogOpen, setCompleteOrderDialogOpen] = useState(false);
  const [ratingOrderDialogOpen, setRatingOrderDialogOpen] = useState(false);

  const [startWorkDialogOpen, setStartWorkDialogOpen] = useState(false);
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [deliverWorkDialogOpen, setDeliverWorkDialogOpen] = useState(false);
  const [reDeliverWorkDialogOpen, setReDeliverWorkDialogOpen] = useState(false);
  const [askQuestionDialogOpen, setAskQuestionDialogOpen] = useState(false);

  const [processing, setProcessing] = useState(false);

  if (isLoading || isValidating) {
    return <CircularProgressCenter />;
  }

  if (error || !order) {
    return (
      <ErrorOrEmptyState
        emptyMessage="Order is not found."
        isEmpty={true}
        retry={mutateThisOrder}
      />
    );
  }

  return (
    <>
      <div className="m-2 flex h-full w-full flex-col gap-2">
        <div className="h-[90%] w-full flex-1">
          <div className="flex h-full w-full gap-x-4">
            <div className="w-1/3 flex-1">
              <OrderOverView actorType={actorType} order={order} />
            </div>

            <div className="w-1/3 flex-1">
              {actorType === ActorType.BUYER && (
                <OrderQuestionAnswers
                  items={order.orderQuestionsAnswers}
                  isBuyer
                  onSubmitAnswer={async (id, answer, file) => {
                    const { data, status } = await submitOrderAnswer(
                      order.id,
                      id,
                      answer,
                      file,
                    );

                    if (status === 200) {
                      mutateThisOrder();
                    }
                  }}
                />
              )}

              {(actorType === ActorType.FREELANCER ||
                actorType === ActorType.ADMIN) && (
                <OrderQuestionAnswers
                  items={order.orderQuestionsAnswers}
                  onAddQuestion={async (question, file) => {
                    const { data, status } = await addOrderQuestion(
                      order.id,
                      question,
                      file,
                    );

                    if (status === 200) {
                      mutateThisOrder();
                    }
                  }}
                />
              )}
            </div>

            <div className="w-1/3 flex-1">
              <OrderLogTimeline logs={order.orderlogs} />
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          {actorType === ActorType.BUYER && (
            <OrderStatusButtonBuyer
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
                setCancelDialogOpen(true);
              }}
              onComplete={() => {
                setCompleteOrderDialogOpen(true);
              }}
              onRate={() => {
                setRatingOrderDialogOpen(true);
              }}
              onRequestRevision={() => {
                setRequestRevisionDialogOpen(true);
              }}
              onRefresh={() => {
                mutateThisOrder();
              }}
            />
          )}

          {actorType === ActorType.FREELANCER && (
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
          )}

          {actorType === ActorType.ADMIN && (
            <OrderStatusButtonAdmin
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
                setCancelDialogOpen(true);
              }}
              onComplete={() => {
                setCompleteOrderDialogOpen(true);
              }}
              onRate={() => {
                setRatingOrderDialogOpen(true);
              }}
              onRequestRevision={() => {
                setRequestRevisionDialogOpen(true);
              }}
              onRefresh={() => {
                mutateThisOrder();
              }}
            />
          )}
        </div>
      </div>

      {actorType === ActorType.BUYER && (
        <div>
          {/* BUYER */}
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
            orderNo={order.orderNo}
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
      )}

      {actorType === ActorType.FREELANCER && (
        <div>
          {/* FREELANCER */}
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
                    console.log(
                      "File uploaded successfully",
                      fileResponse.data,
                    );
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
                    console.log(
                      "File uploaded successfully",
                      fileResponse.data,
                    );
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
      )}

      {actorType === ActorType.ADMIN && (
        <div>
          <OrderCancelDialog
            open={cancelDialogOpen}
            processing={processing}
            onOpenChange={setCancelDialogOpen}
            handleCancelOrder={async () => {
              setProcessing(true);

              try {
                const response = await updateOrderByAction(
                  order.id,
                  OrderActions.CANCEL_ORDER_ADMIN.action,
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
        </div>
      )}
    </>
  );
};
