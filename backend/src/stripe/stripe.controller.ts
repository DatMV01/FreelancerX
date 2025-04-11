import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { StripeService } from './stripe.service';

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
}
