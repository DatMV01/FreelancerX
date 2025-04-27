import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from 'src/modules/order/entities/order.entity';
import { OrderLogsEntity } from 'src/modules/order/entities/order_logs.entity';
import { OrderActions, OrderStatus } from 'src/modules/order/order.enum';
import { OrderTransactionEntity } from 'src/modules/transaction/entities/order_transactions.entity';
import { TransactionStatus } from 'src/modules/transaction/enum/transaction.enum';
import Stripe from 'stripe';
import { Repository } from 'typeorm';

interface CheckoutSessionBody {
  packageId: string;
  amount: number;
  packageName: string;
  price: number;
  userId: string;
}

@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name);

  constructor(
    @Inject('STRIPE_CLIENT') private stripe: Stripe,
    private configService: ConfigService,

    @InjectRepository(OrderTransactionEntity)
    private readonly transactionRepo: Repository<OrderTransactionEntity>,

    @InjectRepository(OrderEntity)
    private readonly orderRepo: Repository<OrderEntity>,

    @InjectRepository(OrderLogsEntity)
    private readonly orderLogRepo: Repository<OrderLogsEntity>,
  ) {}

  async createPaymentIntent(params: {
    amount: number;
    currency?: string;
    metadata: Record<string, any>;
  }) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: params.amount * 100, // cents
      currency: params.currency || 'USD',
      metadata: params.metadata,
    });

    return paymentIntent;
  }

  async createCheckoutSession(body: CheckoutSessionBody) {
    const { packageId, amount, packageName, userId } = body;

    try {
      const session = await this.stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: 'usd',
              unit_amount: amount * 100,
              product_data: {
                name: packageName || `Package #${packageId}`,
                description: 'abc',
              },
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${this.configService.get('FRONTEND_DOMAIN')}/payment-success`,
        cancel_url: `${this.configService.get('FRONTEND_DOMAIN')}/payment-cancel`,
        metadata: {
          userId,
          packageId,
          orderId: '1234',
        },
      });

      this.logger.log(`Stripe Checkout Session created: ${session.id}`);
      return { url: session.url, sessionId: session.id };
    } catch (error) {
      this.logger.error('Error creating Stripe Checkout Session', error);
      throw error;
    }
  }
  // Liên kết thẻ và tạo payment method
  async createPaymentMethod(cardToken: string): Promise<Stripe.PaymentMethod> {
    try {
      // Tạo payment method từ token
      const paymentMethod = await this.stripe.paymentMethods.create({
        type: 'card',
        card: { token: cardToken }, // Token từ frontend
      });
      return paymentMethod;
    } catch (error) {
      throw new Error(`Error creating payment method: ${error.message}`);
    }
  }
  // Thực hiện payout vào thẻ của freelancer
  async processPayout(
    cardToken: string,
    amount: number,
  ): Promise<Stripe.Payout> {
    try {
      // Tạo payment method từ token
      const paymentMethod = await this.createPaymentMethod(cardToken);

      // Thực hiện payout vào thẻ đã liên kết
      const payout = await this.stripe.payouts.create({
        amount: amount * 100, // Số tiền (tính bằng cent)
        currency: 'usd', // Hoặc 'vnd', 'eur', tuỳ vào quốc gia
        method: 'instant', // Phương thức thanh toán: 'instant' hoặc 'standard'
        //   payment_method: paymentMethod.id, // Payment method từ token
      });

      return payout;
    } catch (error) {
      throw new Error(`Error processing payout: ${error.message}`);
    }
  }
  // 👉 Handle Stripe Webhook
  async handleWebhook(
    payload: Buffer,
    signature: string,
  ): Promise<{ success: boolean; message?: string }> {
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        this.configService.get('STRIPE_WEBHOOK_SECRET') as string,
      );
    } catch (err) {
      this.logger.error(`⚠️ Webhook signature verification failed.`, err);
      return { success: false, message: `Webhook Error: ${err.message}` };
    }

    this.logger.log(`Received event: ${event.type}`);

    try {
      switch (event.type) {
        case 'checkout.session.completed':
          await this.handleCheckoutSessionCompleted(event);
          break;

        case 'payment_intent.succeeded':
          await this.handlePaymentIntentSucceeded(event);
          break;

        case 'payment_intent.payment_failed':
          await this.handlePaymentIntentFailed(event);
          break;

        default:
          this.logger.warn(`Unhandled event type: ${event.type}`);
      }

      return { success: true };
    } catch (error) {
      this.logger.error('❌ Error handling webhook event', error);
      return { success: false, message: error.message };
    }
  }

  private async handleCheckoutSessionCompleted(event: Stripe.Event) {
    const session = event.data.object as Stripe.Checkout.Session;

    const metadata = session.metadata as {
      userId: string;
      packageId: string;
    };

    const userId = metadata?.userId;
    const packageId = metadata?.packageId;

    this.logger.log(
      `✅ Payment successful - User: ${userId}, Package: ${packageId}`,
    );
  }

  private async handlePaymentIntentSucceeded(event: Stripe.Event) {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    const metadata = paymentIntent.metadata as any;

    const orderId = metadata?.orderId;
    const buyerId = metadata?.buyerId;
    const gigId = metadata?.gigId;
    const packageId = metadata?.packageId;
    const transactionId = metadata?.transactionId;

    this.logger.log('💾 Saving order:', {
      orderId,
      buyerId,
      gigId,
      packageId,
      transactionId,
      paymentIntentId: packageId.id,
    });

    await this.transactionRepo.update(transactionId, {
      status: TransactionStatus.SUCCESS,
    });

    await this.orderRepo.update(orderId, {
      status: OrderStatus.PENDING,
    });

    await this.orderLogRepo.save({
      orderId,
      userId: buyerId,
      ...OrderActions.PAY_ORDER,
    });
  }

  private async handlePaymentIntentFailed(event: Stripe.Event) {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    const metadata = paymentIntent.metadata as any;

    const orderId = metadata?.orderId;
    const buyerId = metadata?.buyerId;
    const gigId = metadata?.gigId;
    const packageId = metadata?.packageId;
    const transactionId = metadata?.transactionId;

    this.logger.warn('❌ PaymentIntent failed:', {
      orderId,
      buyerId,
      gigId,
      packageId,
      transactionId,
      paymentIntentId: packageId.id,
    });
  }

  async createConnectedAccount({
    userId,
    userEmail,
  }: {
    userId: string;
    userEmail: string;
  }) {
    const account = await this.stripe.accounts.create({
      type: 'express',
      country: 'US',
      email: userEmail,
      business_type: 'individual',
      capabilities: {
        transfers: { requested: true },
      },
      metadata: {
        userId,
      },
    });

    return account;
  }

  async generateAccountLink(
    accountId: string,
    returnUrl: string,
    refreshUrl: string,
  ) {
    const accountLink = await this.stripe.accountLinks.create({
      account: accountId,
      refresh_url: refreshUrl, // Nếu user thất bại có thể quay lại link này để retry
      return_url: returnUrl, // Sau khi user hoàn thành onboarding
      type: 'account_onboarding',
    });

    return accountLink.url;
  }
}
