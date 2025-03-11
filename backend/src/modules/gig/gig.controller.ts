import { Controller, Post, SerializeOptions } from '@nestjs/common';
import { BaseController } from '../base/base.controller';
import { GigEntity } from './entities/gig.entity';
import { GigDto } from './dto/gig.dto';
import { CreateGigDto } from './dto/create-gig.dto';
import { UpdateGigDto } from './dto/update-gig.dto';
import { GigService } from './gig.service';
import { CREATE_GROUP } from 'src/common/constant/serialize.group';

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
    if (data.pricing?.basic?.price) {
      data.basicPrice = data.pricing.basic.price;
    }

    if (data.pricing?.standard?.price) {
      data.standardPrice = data.pricing.standard.price;
    }

    if (data.pricing?.premium?.price) {
      data.premiumPrice = data.pricing.premium.price;
    }

    if (data.sellerId) {
      data.seller = {
        id: data.sellerId,
      } as any;
    }

    if (data.title) {
      data.slug = `${data.title.trim().replaceAll(' ', '-')}-${Date.now()}`;
    }

    return super.create(data);
  }

  protected additionalMapping(dto: GigDto, entity: GigEntity): GigDto {
    return dto;
  }
}
