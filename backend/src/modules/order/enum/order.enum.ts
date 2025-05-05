export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAW = 'WITHDRAW',
  PAYMENT = 'PAYMENT',
  REFUND = 'REFUND',
  EARNING = 'EARNING',
  PLATFORM_FEE = 'PLATFORM_FEE',
  ADJUSTMENT = 'ADJUSTMENT',
}

export enum TransactionMethod {
  BANK = 'BANK',
  PAYPAL = 'PAYPAL',
  WALLET = 'WALLET',
  CRYPTO = 'CRYPTO',
  STRIPE = 'STRIPE',
  VNPAY = 'VNPAY',
  MOMO = 'MOMO',
  MANUAL = 'MANUAL',
}

export enum TransactionDirection {
  IN = 'IN',
  OUT = 'OUT',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  REJECT = 'REJECT',
  FAILED = 'FAILED',
}

export enum ActorType {
  FREELANCER = 'FREELANCER',
  BUYER = 'BUYER',
  SYSTEM = 'SYSTEM',
  ADMIN = 'ADMIN',
}

// 🟡 Status Enum
export enum OrderStatus {
  UNPAID = 'UNPAID', // 🟥 Đơn hàng chưa được thanh toán
  PENDING = 'PENDING', // 🟡 Đơn hàng đã được tạo, đang chờ freelancer chấp nhận
  ACCEPTED = 'ACCEPTED', // 🟢 Freelancer đã chấp nhận đơn, chuẩn bị bắt đầu
  PROGRESS = 'PROGRESS', // 🔨 Freelancer đang thực hiện đơn hàng
  DELIVERED = 'DELIVERED', // 📦 Freelancer đã gửi sản phẩm (chờ buyer phản hồi)
  REVISION = 'REVISION', // 🔄 Buyer yêu cầu chỉnh sửa/giao lại
  COMPLETED = 'COMPLETED', // ✅ Đơn hàng đã hoàn tất (buyer xác nhận hoặc tự động sau thời gian)
  CANCEL = 'CANCEL', // ❌ Đơn hàng bị hủy
  REFUND = 'REFUND', // ❌ Đơn hàng bị haonf tiền
}

// 🔄 Order Actions Mapping
export const OrderActions = {
  CREATE_ORDER: {
    action: 'CREATE_ORDER',
    actorType: ActorType.BUYER,
    fromStatus: undefined,
    toStatus: OrderStatus.UNPAID,
    message: 'Buyer created the order.',
  },
  PAY_ORDER: {
    action: 'PAY_ORDER',
    actorType: ActorType.BUYER,
    fromStatus: OrderStatus.UNPAID,
    toStatus: OrderStatus.PENDING,
    message: 'Buyer paid the order. Waiting for freelancer to accept.',
  },
  ACCEPT_ORDER: {
    action: 'ACCEPT_ORDER',
    actorType: ActorType.FREELANCER,
    fromStatus: OrderStatus.PENDING,
    toStatus: OrderStatus.ACCEPTED,
    message: 'Freelancer accepted the order.',
  },
  START_WORK: {
    action: 'START_WORK',
    actorType: ActorType.FREELANCER,
    fromStatus: OrderStatus.ACCEPTED,
    toStatus: OrderStatus.PROGRESS,
    message: 'Freelancer started working on the order.',
  },
  DELIVER_WORK: {
    action: 'DELIVER_WORK',
    actorType: ActorType.FREELANCER,
    fromStatus: OrderStatus.PROGRESS,
    toStatus: OrderStatus.DELIVERED,
    message: 'Freelancer delivered the work.',
  },
  REQUEST_REVISION: {
    action: 'REQUEST_REVISION',
    actorType: ActorType.BUYER,
    fromStatus: OrderStatus.DELIVERED,
    toStatus: OrderStatus.REVISION,
    message: 'Buyer requested a revision.',
  },
  RE_DELIVER_WORK: {
    action: 'RE_DELIVER_WORK',
    actorType: ActorType.FREELANCER,
    fromStatus: OrderStatus.REVISION,
    toStatus: OrderStatus.DELIVERED,
    message: 'Freelancer re-delivered the work.',
  },
  COMPLETE_ORDER: {
    action: 'COMPLETE_ORDER',
    actorType: ActorType.BUYER,
    fromStatus: OrderStatus.DELIVERED,
    toStatus: OrderStatus.COMPLETED,
    message: 'Buyer marked the order as completed.',
  },
  CANCEL_ORDER_BUYER: {
    action: 'CANCEL_ORDER_BUYER',
    actorType: ActorType.BUYER,
    toStatus: OrderStatus.CANCEL,
    message: 'Buyer canceled the order.',
  },
  CANCEL_ORDER_ADMIN: {
    action: 'CANCEL_ORDER_ADMIN',
    actorType: ActorType.ADMIN,
    toStatus: OrderStatus.CANCEL,
    message: 'Admin canceled the order.',
  },
  CANCEL_ORDER_FREELANCER: {
    action: 'CANCEL_ORDER_FREELANCER',
    actorType: ActorType.FREELANCER,
    toStatus: OrderStatus.CANCEL,
    message: 'Freelancer canceled the order.',
  },
  REFUND_ORDER: {
    action: 'REFUND_ORDER',
    actorType: ActorType.SYSTEM,
    fromStatus: OrderStatus.CANCEL,
    toStatus: OrderStatus.REFUND,
    message: 'Order has been refund',
  },
};

// Optional: If you still need actions in array form
export const OrderActionList = Object.values(OrderActions);
