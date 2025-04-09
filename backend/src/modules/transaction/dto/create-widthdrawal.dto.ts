export class CreateWithdrawalDto {
  amount: number;
  payoutMethod: 'bank' | 'paypal' | 'momo' | 'stripe';
  payoutDetails: string; // e.g., bank info, momo number, etc.
}
