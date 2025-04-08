import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

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
  ) {}

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
      return { url: session.url };
    } catch (error) {
      this.logger.error('Error creating Stripe Checkout Session', error);
      throw error;
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
          // → Cập nhật đơn hàng trong DB, gửi email, v.v.
          await this.handleCheckoutSessionCompleted(event);
          break;

        case 'payment_intent.succeeded':
          // Có thể xử lý thêm nếu bạn dùng trực tiếp PaymentIntent
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
      this.logger.error('Error handling webhook event', error);
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

    // await this.orderService.markPaid(packageId, userId);
  }

  // 👉 Handle 'charge.failed' Event
  private async handlePaymentIntentSucceeded(event: Stripe.Event) {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    const metadata = paymentIntent.metadata as {
      userId: string;
      packageId: string;
      orderId: string;
    };

    const userId = metadata?.userId;
    const packageId = metadata?.packageId;
    const orderId = metadata?.orderId;

    this.logger.log(
      `✅ PaymentIntent succeeded - User: ${userId}, Package: ${packageId}, Order: ${orderId}`,
    );

    // TODO: Update order status in the database, notify the user, etc.
  }

  private async handlePaymentIntentFailed(event: Stripe.Event) {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    const metadata = paymentIntent.metadata as {
      userId: string;
      packageId: string;
      orderId: string;
    };

    const userId = metadata?.userId;
    const packageId = metadata?.packageId;
    const orderId = metadata?.orderId;

    this.logger.warn(
      `❌ PaymentIntent failed - User: ${userId}, Package: ${packageId}, Order: ${orderId}`,
    );

    // TODO: Handle failed payment, notify the user, log the issue, etc.
  }

  
}
