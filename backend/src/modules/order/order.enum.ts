// 🟡 Status Enum
export enum OrderStatus {
  UNPAID = 'UNPAID', // 🟥 Đơn hàng chưa được thanh toán
  PENDING = 'PENDING', // 🟡 Đơn hàng đã được tạo, đang chờ freelancer chấp nhận
  ACCEPTED = 'ACCEPTED', // 🟢 Freelancer đã chấp nhận đơn, chuẩn bị bắt đầu
  IN_PROGRESS = 'IN_PROGRESS', // 🔨 Freelancer đang thực hiện đơn hàng
  DELIVERED = 'DELIVERED', // 📦 Freelancer đã gửi sản phẩm (chờ buyer phản hồi)
  REVISION_REQUESTED = 'REVISION_REQUESTED', // 🔄 Buyer yêu cầu chỉnh sửa/giao lại
  COMPLETED = 'COMPLETED', // ✅ Đơn hàng đã hoàn tất (buyer xác nhận hoặc tự động sau thời gian)
  CANCEL = 'CANCEL', // ❌ Đơn hàng bị hủy
}

// 👤 Order Actors
export const OrderActor = {
  BUYER: 'BUYER',
  FREELANCER: 'FREELANCER',
  SYSTEM: 'SYSTEM',
} as const;

type OrderActorType = (typeof OrderActor)[keyof typeof OrderActor];

// 🔄 Order Actions Mapping
export const OrderActions = {
  CREATE_ORDER: {
    action: 'CREATE_ORDER',
    actor: OrderActor.BUYER,
    fromStatus: undefined,
    toStatus: OrderStatus.UNPAID,
    message: 'Buyer created the order.',
  },
  PAY_ORDER: {
    action: 'PAY_ORDER',
    actor: OrderActor.BUYER,
    fromStatus: OrderStatus.UNPAID,
    toStatus: OrderStatus.PENDING,
    message: 'Buyer paid the order. Waiting for freelancer to accept.',
  },
  ACCEPT_ORDER: {
    action: 'ACCEPT_ORDER',
    actor: OrderActor.FREELANCER,
    fromStatus: OrderStatus.PENDING,
    toStatus: OrderStatus.ACCEPTED,
    message: 'Freelancer accepted the order.',
  },
  START_WORK: {
    action: 'START_WORK',
    actor: OrderActor.FREELANCER,
    fromStatus: OrderStatus.ACCEPTED,
    toStatus: OrderStatus.IN_PROGRESS,
    message: 'Freelancer started working on the order.',
  },
  DELIVER_WORK: {
    action: 'DELIVER_WORK',
    actor: OrderActor.FREELANCER,
    fromStatus: OrderStatus.IN_PROGRESS,
    toStatus: OrderStatus.DELIVERED,
    message: 'Freelancer delivered the work.',
  },
  REQUEST_REVISION: {
    action: 'REQUEST_REVISION',
    actor: OrderActor.BUYER,
    fromStatus: OrderStatus.DELIVERED,
    toStatus: OrderStatus.REVISION_REQUESTED,
    message: 'Buyer requested a revision.',
  },
  RE_DELIVER_WORK: {
    action: 'RE_DELIVER_WORK',
    actor: OrderActor.FREELANCER,
    fromStatus: OrderStatus.REVISION_REQUESTED,
    toStatus: OrderStatus.DELIVERED,
    message: 'Freelancer re-delivered the work.',
  },
  COMPLETE_ORDER: {
    action: 'COMPLETE_ORDER',
    actor: OrderActor.BUYER,
    fromStatus: OrderStatus.DELIVERED,
    toStatus: OrderStatus.COMPLETED,
    message: 'Buyer marked the order as completed.',
  },
  CANCEL_ORDER_BUYER: {
    action: 'CANCEL_ORDER_BUYER',
    actor: OrderActor.BUYER,
    toStatus: OrderStatus.CANCEL,
    message: 'Buyer canceled the order.',
  },
  CANCEL_ORDER_FREELANCER: {
    action: 'CANCEL_ORDER_FREELANCER',
    actor: OrderActor.FREELANCER,
    toStatus: OrderStatus.CANCEL,
    message: 'Freelancer canceled the order.',
  },
} as const;

// Optional: If you still need actions in array form
export const OrderActionList = Object.values(OrderActions);
