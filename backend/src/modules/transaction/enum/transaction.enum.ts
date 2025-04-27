export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  PAYMENT = 'PAYMENT',
  REFUND = 'REFUND',
  EARNING = 'EARNING',
  PLATFORM_FEE = 'PLATFORM_FEE',
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
  FAILED = 'FAILED',
}

export enum ActorType {
  FREELANCER = 'FREELANCER',
  BUYER = 'BUYER',
  SYSTEM = 'SYSTEM',
}
