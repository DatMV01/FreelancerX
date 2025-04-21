export enum OrderStatus {
  UNPAID = 'UNPAID', // 🟥 Đơn hàng chưa được thanh toán
  PENDING = 'PENDING', // 🟡 Đơn hàng đã được tạo, đang chờ freelancer chấp nhận
  ACCEPTED = 'ACCEPTED', // 🟢 Freelancer đã chấp nhận đơn, chuẩn bị bắt đầu
  IN_PROGRESS = 'IN_PROGRESS', // 🔨 Freelancer đang thực hiện đơn hàng
  DELIVERED = 'DELIVERED', // 📦 Freelancer đã gửi sản phẩm (chờ buyer phản hồi)
  REVISION_REQUESTED = 'REVISION_REQUESTED', // 🔄 Buyer yêu cầu chỉnh sửa/giao lại
  COMPLETED = 'COMPLETED', // ✅ Đơn hàng đã hoàn tất (buyer xác nhận hoặc tự động sau thời gian)
  CANCEL = 'CANCEL',
  // PENDING = 'PENDING',
  // PAID = 'PAID',
  // IN_PROGRESS = 'IN_PROGRESS',
  // DELIVERED = 'DELIVERED',
  // COMPLETED = 'COMPLETED',
  // CANCELED = 'CANCELED',
  // REFUNDED = 'REFUNDED',
}

export const OrderActor = {
  BUYER: 'BUYER',
  FREELANCER: 'FREELANCER',
  SYSTEM: 'SYSTEM',
};

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
    toStatus: 'ACCEPTED',
    message: 'Freelancer accepted the order.',
  },
  START_WORK: {
    action: 'START_WORK',
    actor: OrderActor.FREELANCER,
    fromStatus: 'ACCEPTED',
    toStatus: 'IN_PROGRESS',
    message: 'Freelancer started working on the order.',
  },
  DELIVER_WORK: {
    action: 'DELIVER_WORK',
    actor: OrderActor.FREELANCER,
    fromStatus: 'IN_PROGRESS',
    toStatus: 'DELIVERED',
    message: 'Freelancer delivered the work.',
  },
  REQUEST_REVISION: {
    action: 'REQUEST_REVISION',
    actor: OrderActor.BUYER,
    fromStatus: 'DELIVERED',
    toStatus: 'REVISION_REQUESTED',
    message: 'Buyer requested a revision.',
  },
  RE_DELIVER_WORK: {
    action: 'RE_DELIVER_WORK',
    actor: OrderActor.FREELANCER,
    fromStatus: 'REVISION_REQUESTED',
    toStatus: 'DELIVERED',
    message: 'Freelancer re-delivered the work.',
  },
  COMPLETE_ORDER: {
    action: 'COMPLETE_ORDER',
    actor: OrderActor.BUYER,
    fromStatus: 'DELIVERED',
    toStatus: 'COMPLETED',
    message: 'Buyer marked the order as completed.',
  },
  CANCEL_ORDER: {
    action: 'CANCEL_ORDER',
    toStatus: 'CANCEL',
    message: 'Buyer canceled the order.',
  },
};

const actionsArr = [
  {
    action: 'CREATE_ORDER',
    fromStatus: null,
    toStatus: OrderStatus.UNPAID,
    message: 'Buyer created the order.',
  },
  {
    action: 'PAY_ORDER',
    fromStatus: OrderStatus.UNPAID,
    toStatus: OrderStatus.PENDING,
    message: 'Buyer paid the order. Waiting for freelancer to accept.',
  },
  {
    action: 'ACCEPT_ORDER',
    fromStatus: 'PENDING',
    toStatus: 'ACCEPTED',
    message: 'Freelancer accepted the order.',
  },
  {
    action: 'START_WORK',
    fromStatus: 'ACCEPTED',
    toStatus: 'IN_PROGRESS',
    message: 'Freelancer started working on the order.',
  },
  {
    action: 'DELIVER_WORK',
    fromStatus: 'IN_PROGRESS',
    toStatus: 'DELIVERED',
    message: 'Freelancer delivered the work.',
  },
  {
    action: 'REQUEST_REVISION',
    fromStatus: 'DELIVERED',
    toStatus: 'REVISION_REQUESTED',
    message: 'Buyer requested a revision.',
  },
  {
    action: 'RE_DELIVER_WORK',
    fromStatus: 'REVISION_REQUESTED',
    toStatus: 'DELIVERED',
    message: 'Freelancer re-delivered the work.',
  },
  {
    action: 'COMPLETE_ORDER',
    fromStatus: 'DELIVERED',
    toStatus: 'COMPLETED',
    message: 'Buyer marked the order as completed.',
  },
  {
    action: 'CANCEL_ORDER',
    fromStatus: 'PENDING',
    toStatus: 'CANCEL',
    message: 'Buyer canceled the order.',
  },
];
