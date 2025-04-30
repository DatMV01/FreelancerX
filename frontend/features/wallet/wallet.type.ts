// types/wallet.ts
export interface WalletEntity {
  id: string;
  userId: string;
  availableBalance: number;
  currency: string;
  createdAt: string | Date;
}

// WalletTransactionEntity

export type TransactionType = "DEPOSIT" | "WITHDRAW" | "TRANSFER";
export type TransactionStatus = "PENDING" | "SUCCESS" | "REJECT" | "FAILED";
export type ActorType = "FREELANCER" | "BUYER";
export type TransactionMethod = "paypal" | "bank" | "momo" | "stripe";

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
  approvedAt: Date | null;
  rejectedAt: Date | null;
}
