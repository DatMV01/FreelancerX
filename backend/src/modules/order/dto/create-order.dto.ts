export class CreateOrderDto {
  items: CreateOrderItemDto[];
  paymentMethod: 'stripe' | 'vnpay' | 'paypal';
}

export class CreateOrderItemDto {
  packageId: string;
  quantity: number;
}
