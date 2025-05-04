import { Separator } from "@/components/ui/separator";

import { axiosInstanceV1 } from "@/lib/axios/axiosInstance";
import { CircularProgress } from "@mui/material";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import { ActorType, OrderActions, OrderActorType } from "../dto";
import {
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
  const [startWorkDialogOpen, setStartWorkDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [completeOrderDialogOpen, setCompleteOrderDialogOpen] = useState(false);
  const [ratingOrderDialogOpen, setRatingOrderDialogOpen] = useState(false);

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
      <div className="m-2 flex h-full flex-col gap-2">
        <div className="h-[90%] flex-1">
          <div className="flex h-full gap-x-4">
            <div className="flex-1">
              <OrderOverView order={order} />
            </div>

            <div className="flex-1">
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
            </div>

            <div className="flex-1">
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
        </div>
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
    </>
  );
};
