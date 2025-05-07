import { BaseController } from '../base/base.controller';
import { CreateGigDto } from './dto/create-gig.dto';
import { GigDto, PricingPackage } from './dto/gig.dto';
import { UpdateGigDto } from './dto/update-gig.dto';
import { GigEntity } from './entities/gig.entity';
import { GigService } from './gig.service';

import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  SerializeOptions,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import {
  CREATE_GROUP
} from 'src/common/constant/serialize.group';
import { CurrentUser } from 'src/common/decorators';
import { JwtAccessPayloadType } from '../auth/strategies/types/jwt-access-payload.type';
import { FreelancerDto } from '../freelancer/dto/freelancer.dto';
import { AddFavoriteGigDto } from './dto/add-favorite-gig.dto';

@Controller('gigs')
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
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({ groups: [CREATE_GROUP] })
  @ApiOperation({ summary: 'Create a new gig' })
  @ApiBody({ type: CreateGigDto, required: false })
  @ApiResponse({
    status: 201,
    description: 'Entity created successfully',
    type: GigDto,
  })
  async createGig(
    @Body() data: CreateGigDto,

    @CurrentUser() currentUser: JwtAccessPayloadType,
  ): Promise<GigDto> {
    if (data.pricingPackage) {
      const pricePackage = Array.from(data.pricingPackage).find(
        (_: PricingPackage) => _.package === 'Price',
      );

      data.basicPrice = Number(pricePackage?.basic || 0);

      data.standardPrice = Number(pricePackage?.standard || 0);

      data.premiumPrice = Number(pricePackage?.premium || 0);
    }

    data.userId = currentUser.id;

    // if (String(data.category).includes('||')) {
    //   const _ = data.category.split('||');
    //   data.category = _[0];
    //   data.categoryId = _[1];
    // }

    // if (String(data.subCategory).includes('||')) {
    //   const _ = data.subCategory.split('||');
    //   data.subCategory = _[0];
    //   data.subCategoryId = _[1];
    // }

    // if (String(data.nestedSubcategory).includes('||')) {
    //   const _ = data.nestedSubcategory.split('||');
    //   data.nestedSubcategory = _[0];
    //   data.nestedSubcategoryId = _[1];
    // }

    return super.create(data);
  }

  @Get('/slug/:slug')
  async findOneBySlug(@Param('slug') slug: string) {
    const entity = await this._service.findOneBySlug({
      where: { slug },
     // relations: ['freelancer', 'freelancer.user'],
    });

    return this.mapFromEntityToDto(entity);
  }

  @Post('/favorites')
  @UseGuards(AuthGuard('jwt'))
  async addFavoriteGig(
    @Body() data: AddFavoriteGigDto,
    @CurrentUser() currentUser: JwtAccessPayloadType,
  ) {
    const { gigId } = data;

    if (!gigId) throw new BadRequestException('GigID empty');

    return await this._service.addFavoriteGig(data, currentUser);
  }

  @Delete('/favorites/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Soft delete an entity' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Entity deleted successfully' })
  async removeFavoriteGig(
    @Param('id') id: string,
    @CurrentUser() currentUser: JwtAccessPayloadType,
  ) {
    if (!id) throw new BadRequestException('GigID empty');

    return await this._service.removeFavoriteGig(id, currentUser);
  }

  @Get('/favorites')
  @UseGuards(AuthGuard('jwt'))
  async getFovoriteGigs(@CurrentUser() currentUser: JwtAccessPayloadType) {
    const [results, count] = await this._service.findFovoriteGigs(currentUser);

    return results;
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
    return { ...dto, freelancer: new FreelancerDto({ ...dto.freelancer }) };
  }
}
