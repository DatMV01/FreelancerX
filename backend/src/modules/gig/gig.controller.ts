import { Controller, Post, SerializeOptions } from '@nestjs/common';
import { CREATE_GROUP } from 'src/common/constant/serialize.group';
import { BaseController } from '../base/base.controller';
import { CreateGigDto } from './dto/create-gig.dto';
import { GigDto, PricingPackage } from './dto/gig.dto';
import { UpdateGigDto } from './dto/update-gig.dto';
import { GigEntity } from './entities/gig.entity';
import { GigService } from './gig.service';

@Controller('gig')
export class GigController extends BaseController<
  GigEntity,
  GigDto,
  CreateGigDto,
  UpdateGigDto
> {
  constructor(protected readonly _service: GigService) {
    super(_service, GigDto, GigEntity);
  }

  @Post()
  @SerializeOptions({ groups: [CREATE_GROUP] })
  async create(data: CreateGigDto): Promise<GigDto> {
    if (data.pricing) {
      const pricePackage = Array.from(data.pricing).find(
        (_: PricingPackage) => _.package === 'Price',
      );

      data.basicPrice = Number(pricePackage?.basic || 0);

      data.standardPrice = Number(pricePackage?.standard || 0);

      data.premiumPrice = Number(pricePackage?.premium || 0);
    }

    return super.create(data);
  }

  protected additionalMapping(dto: GigDto, entity: GigEntity): GigDto {
    return dto;
  }
}
