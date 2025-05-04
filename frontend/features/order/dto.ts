// 🟡 Status Enum
export enum OrderStatus {
  UNPAID = "UNPAID", // 🟥 Đơn hàng chưa được thanh toán
  PENDING = "PENDING", // 🟡 Đơn hàng đã được tạo, đang chờ freelancer chấp nhận
  ACCEPTED = "ACCEPTED", // 🟢 Freelancer đã chấp nhận đơn, chuẩn bị bắt đầu
  IN_PROGRESS = "IN_PROGRESS", // 🔨 Freelancer đang thực hiện đơn hàng
  DELIVERED = "DELIVERED", // 📦 Freelancer đã gửi sản phẩm (chờ buyer phản hồi)
  REVISION_REQUESTED = "REVISION_REQUESTED", // 🔄 Buyer yêu cầu chỉnh sửa/giao lại
  COMPLETED = "COMPLETED", // ✅ Đơn hàng đã hoàn tất (buyer xác nhận hoặc tự động sau thời gian)
  CANCEL = "CANCEL", // ❌ Đơn hàng bị hủy
  REFUND = "REFUND",
}

export enum ActorType {
  FREELANCER = "FREELANCER",
  BUYER = "BUYER",
  SYSTEM = "SYSTEM",
  ADMIN = "ADMIN",
}
 
export type OrderActorType = (typeof ActorType)[keyof typeof ActorType];

// 🔄 Order Actions Mapping
export const OrderActions = {
  CREATE_ORDER: {
    action: "CREATE_ORDER",
    actor: ActorType.BUYER,
    fromStatus: undefined,
    toStatus: OrderStatus.UNPAID,
    message: "Buyer created the order.",
  },
  PAY_ORDER: {
    action: "PAY_ORDER",
    actor: ActorType.BUYER,
    fromStatus: OrderStatus.UNPAID,
    toStatus: OrderStatus.PENDING,
    message: "Buyer paid the order. Waiting for freelancer to accept.",
  },
  ACCEPT_ORDER: {
    action: "ACCEPT_ORDER",
    actor: ActorType.FREELANCER,
    fromStatus: OrderStatus.PENDING,
    toStatus: OrderStatus.ACCEPTED,
    message: "Freelancer accepted the order.",
  },
  START_WORK: {
    action: "START_WORK",
    actor: ActorType.FREELANCER,
    fromStatus: OrderStatus.ACCEPTED,
    toStatus: OrderStatus.IN_PROGRESS,
    message: "Freelancer started working on the order.",
  },
  DELIVER_WORK: {
    action: "DELIVER_WORK",
    actor: ActorType.FREELANCER,
    fromStatus: OrderStatus.IN_PROGRESS,
    toStatus: OrderStatus.DELIVERED,
    message: "Freelancer delivered the work.",
  },
  REQUEST_REVISION: {
    action: "REQUEST_REVISION",
    actor: ActorType.BUYER,
    fromStatus: OrderStatus.DELIVERED,
    toStatus: OrderStatus.REVISION_REQUESTED,
    message: "Buyer requested a revision.",
  },
  RE_DELIVER_WORK: {
    action: "RE_DELIVER_WORK",
    actor: ActorType.FREELANCER,
    fromStatus: OrderStatus.REVISION_REQUESTED,
    toStatus: OrderStatus.DELIVERED,
    message: "Freelancer re-delivered the work.",
  },
  COMPLETE_ORDER: {
    action: "COMPLETE_ORDER",
    actor: ActorType.BUYER,
    fromStatus: OrderStatus.DELIVERED,
    toStatus: OrderStatus.COMPLETED,
    message: "Buyer marked the order as completed.",
  },
  CANCEL_ORDER_BUYER: {
    action: "CANCEL_ORDER_BUYER",
    actor: ActorType.BUYER,
    toStatus: OrderStatus.CANCEL,
    message: "Buyer canceled the order.",
  },
  CANCEL_ORDER_FREELANCER: {
    action: "CANCEL_ORDER_FREELANCER",
    actor: ActorType.FREELANCER,
    toStatus: OrderStatus.CANCEL,
    message: "Freelancer canceled the order.",
  },
} as const;

// Optional: If you still need actions in array form
export const OrderActionList = Object.values(OrderActions);

export const orderStatus = Object.values(OrderStatus);
export const orderFreelancerStatus = orderStatus.filter((_) => _ !== "UNPAID");

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
