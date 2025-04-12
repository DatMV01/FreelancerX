export enum OrderStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  IN_PROGRESS = "IN_PROGRESS",
  DELIVERED = "DELIVERED",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED",
  REFUNDED = "REFUNDED",
}

export const orderStatus = Object.values(OrderStatus);


