export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAW = 'WITHDRAW',
  PAYMENT = 'PAYMENT',
  REFUND = 'REFUND',
  EARNING = 'EARNING',
  PLATFORM_FEE = 'PLATFORM_FEE',
  ADJUSTMENT = 'ADJUSTMENT', // admin cộng/trừ tay
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
