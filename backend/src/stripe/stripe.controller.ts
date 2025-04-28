import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { StripeService } from './stripe.service';
import { CreatePayoutDto } from './payout.dto';

@Controller('stripe')
export class StripeController {
  constructor(private stripeService: StripeService) {}

  @Post('create-checkout-session')
  async createCheckoutSession(@Body() body) {
    return this.stripeService.createCheckoutSession(body);
  }

  @Post('create-payment-intent')
  async create(@Body() body) {
    const { amount, orderInfo } = body;

    const clientSecret = await this.stripeService.createPaymentIntent({
      amount,
      currency: 'USD',
      metadata: orderInfo,
    });
    return { clientSecret };
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('stripe-signature') signature: string,
  ) {
    try {
      await this.stripeService.handleWebhook(req.body, signature);
      res.status(200).send('Received');
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }

  @Post('/payout/transfer-money')
  async transferMoney(@Body() body: { cardToken: string; amount: number }) {
    const { cardToken, amount } = body;
    try {
      const payout = await this.stripeService.processPayout(cardToken, amount);
      return { success: true, payout };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // @Get('create-connected-account')
  // async createConnectedAccount(@Query('userId') userId: string) {
  //   const account = await this.stripeService.createConnectedAccount(userId);

  //   const onboardingUrl = await this.stripeService.generateAccountLink(
  //     account.id,
  //     'https://your-app.com/onboarding-success', // Chỉnh link của bạn
  //     'https://your-app.com/onboarding-retry', // Chỉnh link của bạn
  //   );

  //   return {
  //     accountId: account.id, // Lưu accountId này vào database
  //     onboardingUrl,
  //   };
  // }
}
