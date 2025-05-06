// types/wallet.ts
export interface WalletEntity {
  id: string;
  userId: string;
  availableBalance: number;
  currency: string;
  createdAt: string | Date;
}

// WalletTransactionEntity

export enum TransactionType {
  DEPOSIT = "DEPOSIT",
  WITHDRAW = "WITHDRAW",
  PAYMENT = "PAYMENT",
  REFUND = "REFUND",
  EARNING = "EARNING",
  PLATFORM_FEE = "PLATFORM_FEE",
  ADJUSTMENT = "ADJUSTMENT", // admin cộng/trừ tay
}

export enum TransactionStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  REJECT = "REJECT",
  FAILED = "FAILED",
}
export const transactionStatus = Object.values(TransactionStatus);

export enum ActorType {
  FREELANCER = "FREELANCER",
  BUYER = "BUYER",
  SYSTEM = "SYSTEM",
  ADMIN = "ADMIN",
}

export enum TransactionMethod {
  BANK = "BANK",
  PAYPAL = "PAYPAL",
  WALLET = "WALLET",
  CRYPTO = "CRYPTO",
  STRIPE = "STRIPE",
  // VNPAY = 'VNPAY',
  // MOMO = 'MOMO',
  MANUAL = "MANUAL",
}

export interface WalletTransactionEntity {
  id: string;
  walletId: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  actorType: ActorType;
  actorId: string;
  referenceCode?: string;
  balanceBefore: number;
  balanceAfter: number;
  method?: TransactionMethod;
  metadata?: Record<string, any>;
  description?: string;
  currency: string;
  createdAt: Date;
  processedAt: string | null;
  processedBy: string | null;
}
