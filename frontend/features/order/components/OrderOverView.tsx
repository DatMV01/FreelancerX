import { Separator } from "@/components/ui/separator";

import { format, addDays } from "date-fns";
import useSWR from "swr";
import { getOrderReviewById } from "../order.api";
import { OrderEntity } from "../order.entity";
import { OrderDeliveryWork } from "./OrderDeliveryWork";
import OrderReview from "./OrderReview";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { OrderTypeBadge } from "./OrderTypeBadge";
import { ActorType } from "../dto";
import { replyOrderComment } from "@/features/reviews/reviews.api";
import { toast } from "sonner";
import CircularProgressCenter from "@/components/CircularProgressCenter";

export const RenderKeyValue = ({ k, v }: { k: string; v: any }) => {
  return (
    <p className="grid grid-cols-12 gap-2 text-sm">
      <span className="col-span-3 break-words">{k}</span>

      <p className="col-span-9">
        {typeof v === "string" ? (
          <span className="text-muted-foreground">{v}</span>
        ) : (
          v
        )}
      </p>
    </p>
  );
};

const RenderKeyValue2 = ({ k, v }: { k: string; v: any }) => {
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

const OrderOverView = ({
  order,
  actorType,
}: {
  order: OrderEntity;
  actorType: ActorType;
}) => {
  const sortedDeliverables = [...order?.deliverables].sort(
    (a: any, b: any) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const {
    data: review,
    isLoading,
    isValidating,
    mutate: mutateReview,
  } = useSWR(
    order?.id ? `reviews/order/${order.id}` : null,
    () => getOrderReviewById(order.id),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
      dedupingInterval: 0,
    },
  );

  if (!order) {
    return (
      <div className="flex h-full flex-col gap-y-2 border-r">
        <p className="text-center text-lg font-semibold">Overview</p>
      </div>
    );
  }

  if (isLoading || isValidating) {
    return (
      <div className="flex h-full flex-col gap-y-2 border-r">
        <p className="text-center text-lg font-semibold">Overview</p>
        <CircularProgressCenter />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col  gap-y-2 border-r p-2">
      <p className="text-center text-lg font-semibold">Overview</p>

      <div className="flex h-full flex-col gap-y-2 overflow-x-hidden pr-2 overflow-y-auto">
        <div className="flex flex-col gap-y-2">
          <RenderKeyValue
            k="Order No"
            v={
              <span className="font-bold text-green-900">{order.orderNo}</span>
            }
          />

          <RenderKeyValue
            k="Status"
            v={<OrderStatusBadge status={order.status} />}
          />

          <RenderKeyValue
            k="Order At"
            v={format(new Date(order.createdAt), "dd/MM/yyyy HH:mm")}
          />

          <RenderKeyValue
            k="Start At"
            v={
              order.startDate
                ? format(new Date(order.startDate), "dd/MM/yyyy")
                : "N/A"
            }
          />

          <RenderKeyValue
            k="End At"
            v={
              order.endDate
                ? format(new Date(order.startDate), "dd/MM/yyyy")
                : "N/A"
            }
          />

          <RenderKeyValue
            k="Deadline"
            v={
              order.startDate
                ? format(
                    addDays(new Date(order.startDate), order.deliveryTime),
                    "dd/MM/yyyy",
                  )
                : "N/A"
            }
          />
        </div>

        {/* Freelancer info */}
        <Separator />
        <div className="grid grid-cols-1 xl:grid-cols-2">
          <div className="flex flex-col gap-y-2">
            <p className="font-bold">Buyer</p>

            {/* <RenderKeyValue k="Full Name" v={order.snapshot.buyer.fullName} /> */}

            <RenderKeyValue k="Name" v={order.snapshot.buyer.fullName} />

            <RenderKeyValue
              k="Email"
              v={
                <a href="#" className="text-muted-foreground hover:underline">
                  {order.snapshot.buyer.email}
                </a>
              }
            />
          </div>

          <div className="flex flex-col gap-y-2">
            <p className="font-bold">Freelancer</p>

            {/* <RenderKeyValue
              k="Display Name"
              v={order.snapshot.freelancer.displayName}
            /> */}

            <RenderKeyValue
              k="Name"
              v={order.snapshot.freelancer.displayName}
            />

            {/* <div className="flex border text-sm">
              <p className="w-5/12">Display Name</p>
              <p className="text-muted-foreground">
                {order.snapshot.freelancer.displayName}
              </p>
            </div> */}

            <RenderKeyValue
              k="Email"
              v={
                <a href="#" className="text-muted-foreground hover:underline">
                  {order.snapshot.freelancer.email}
                </a>
              }
            />
          </div>
        </div>

        {/* Order content */}
        <Separator />
        <div className="flex flex-col gap-y-2">
          <p className="font-bold">Order Detail</p>

          <RenderKeyValue k="Total Price" v={order.totalAmount.toString()} />

          <RenderKeyValue k="Gig" v={order.snapshot.gig.title} />

          <RenderKeyValue k="Package" v={order.snapshot.package.title} />

          <RenderKeyValue
            k="Type"
            v={
              <OrderTypeBadge
                type={order.snapshot.package.type.toUpperCase()}
              />
            }
          />

          <RenderKeyValue
            k="Description"
            v={order.snapshot.package.description.toString()}
          />

          <RenderKeyValue k="Delivery Days" v={order.deliveryTime.toString()} />

          <RenderKeyValue
            k="Revisions"
            v={order.snapshot.package.revisions.toString()}
          />
        </div>

        <Separator />
        <div className="flex flex-col gap-y-1">
          <p className="font-bold"> Deliverables</p>
          {sortedDeliverables?.map((item: any) => (
            <OrderDeliveryWork key={item.id} delivery={item} />
          ))}
        </div>

        <Separator />
        <div>
          <p className="font-bold"> Review</p>
          {review && actorType == ActorType.BUYER && (
            <OrderReview review={review} />
          )}

          {review && actorType == ActorType.FREELANCER && (
            <OrderReview
              review={review}
              isFreelancer
              onReplySubmit={async (reviewId, replyText) => {
                console.log(review);

                try {
                  const response = await replyOrderComment(
                    reviewId,
                    replyText,
                    order.freelancerId,
                  );

                  if (response.status === 200) {
                    mutateReview();
                  }
                } catch (error: any) {
                  toast.error("Reply Review Error");
                }
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderOverView;
