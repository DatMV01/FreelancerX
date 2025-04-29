import { ActorType } from "../enum/transaction.enum";

// request-withdrawal.dto.ts
export class RequestWithdrawalDto {
  amount: string;
  paymentMethod: string;
  accountInfo: string;
}

// adjust-balance.dto.ts
export class AdjustBalanceDto {
  userId: string;
  amount: string;
  actorType: ActorType
  description: string;
}

// approve-reject.dto.ts
export class ApproveOrRejectDto {
  transactionId: string;
  reason?: string;
}

// filter-transaction.dto.ts
export class FilterTransactionDto {
  type?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}
