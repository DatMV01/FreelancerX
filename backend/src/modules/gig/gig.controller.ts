import { BaseController } from '../base/base.controller';
import { CreateGigDto } from './dto/create-gig.dto';
import { GigDto, PricingPackage } from './dto/gig.dto';
import { UpdateGigDto } from './dto/update-gig.dto';
import { GigEntity } from './entities/gig.entity';
import { GigService } from './gig.service';

import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import {
  CREATE_GROUP,
  UPDATE_GROUP,
} from 'src/common/constant/serialize.group';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('gig')
export class GigController extends BaseController<
  GigEntity,
  GigDto,
  CreateGigDto,
  UpdateGigDto
> {
  constructor(protected readonly _service: GigService) {
    super(_service, GigEntity, GigDto, CreateGigDto, UpdateGigDto);
  }

  @Post()
  // @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({ groups: [CREATE_GROUP] })
  @ApiOperation({ summary: 'Create a new entity' })
  @ApiBody({ type: CreateGigDto, required: false })
  @ApiResponse({
    status: 201,
    description: 'Entity created successfully',
    type: GigDto,
  })
  async create(data: CreateGigDto): Promise<GigDto> {
    if (data.pricingPackage) {
      const pricePackage = Array.from(data.pricingPackage).find(
        (_: PricingPackage) => _.package === 'Price',
      );

      data.basicPrice = Number(pricePackage?.basic || 0);

      data.standardPrice = Number(pricePackage?.standard || 0);

      data.premiumPrice = Number(pricePackage?.premium || 0);
    }

    return super.create(data);
  }

  @Get('/slug/:slug')
  async findOneBySlug(@Param('slug') slug: string) {
    const entity = await this._service.findOne({ where: { slug } });

    if (!entity) {
      throw new NotFoundException(`Gig with slug: ${slug} not found`);
    }

    return this.mapFromEntityToDto(entity);
  }

  async findOneBySlug2(@Param('slug') slug: string) {
    const queryBuilder = this.getQueryBuilder();
    const entity = await queryBuilder
      .leftJoinAndSelect(`${queryBuilder.alias}.category`, 'category')
      .leftJoinAndSelect(`${queryBuilder.alias}.subCategory`, 'subCategory')
      .leftJoinAndSelect(
        `${queryBuilder.alias}.nestedSubcategory`,
        'nestedSubcategory',
      )
      .leftJoinAndSelect(`${queryBuilder.alias}.orders`, 'orders')
      .leftJoinAndSelect(`${queryBuilder.alias}.reviews`, 'reviews')
      .leftJoinAndSelect(`${queryBuilder.alias}.freelancer`, 'freelancer')

      .leftJoin('freelancer.userProfile', 'userProfile')
      .addSelect([
        'userProfile.email',
        'userProfile.fullName',
        'userProfile.avatar',
        'userProfile.phoneNumber',
        'userProfile.country',
      ])

      .leftJoin('userProfile.status', 'status')
      .addSelect(['status.id', 'status.name'])

      .where(`${queryBuilder.alias}.slug  =:slug`, {
        slug,
      })
      .getOne();

    if (!entity) {
      throw new NotFoundException(`Gig with slug: ${slug} not found`);
    }

    return this.mapFromEntityToDto(entity);
  }

  protected additionalMapping(dto: GigDto, entity: GigEntity): GigDto {
    return { ...dto };
  }
}
