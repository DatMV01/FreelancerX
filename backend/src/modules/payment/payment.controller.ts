import { Controller } from '@nestjs/common';
import { BaseController } from '../base/base.controller';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentDto } from './dto/payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentEntity } from './entities/payment.entity';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController extends BaseController<
  PaymentEntity,
  PaymentDto,
  CreatePaymentDto,
  UpdatePaymentDto
> {
  constructor(protected readonly _service: PaymentService) {
    super(
      _service,
      PaymentEntity,
      PaymentDto,
      CreatePaymentDto,
      UpdatePaymentDto,
    );
  }
}
