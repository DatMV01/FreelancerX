import { BadRequestException, Controller } from '@nestjs/common';
import { BaseController } from '../base/base.controller';
import { CreateSellerDto } from './dto/create-seller.dto';
import { SellerDto } from './dto/seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { SellerEntity } from './entities/seller.entity';
import { SellerService } from './seller.service';

@Controller('seller')
export class SellerController extends BaseController<
  SellerEntity,
  SellerDto,
  CreateSellerDto,
  UpdateSellerDto
> {
  constructor(protected readonly _service: SellerService) {
    super(_service, SellerDto, SellerEntity);
  }
}
