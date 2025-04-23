import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isNumberParse } from 'src/utils/common';
import {
  Between,
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  In,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { JwtAccessPayloadType } from '../auth/strategies/types/jwt-access-payload.type';
import { BaseService } from '../base/base.service';
import { BaseEntity } from '../base/entities/base.entity';
import { FreelancerService } from '../freelancer/freelancer.service';
import { RoleEnum } from '../role/enum/role.enum';
import { GigEntity, GigTagEntity } from './entities/gig.entity';
import {
  GigPackagesEntity,
  GigPackageType,
} from './entities/gig_packages.entity';
import { GigStatus } from './enum/gig.status';

@Injectable()
export class GigService extends BaseService<GigEntity> {
  constructor(
    @InjectRepository(GigEntity)
    private readonly _repository: Repository<GigEntity>,

    @InjectRepository(GigTagEntity)
    private readonly gigTagRepository: Repository<GigTagEntity>,

    @InjectRepository(GigPackagesEntity)
    private readonly gigPackageRepository: Repository<GigPackagesEntity>,

    private readonly freelancerService: FreelancerService,
  ) {
    super(_repository);
  }

  async create(createDto: DeepPartial<GigEntity>): Promise<GigEntity> {
    const freelancer = await this.freelancerService.findOne({
      where: { userId: createDto.userId },
    });

    const createdTags = await this.createTags(createDto.tags || []);

    const [basic, standard, premium] = this.transformPackages(
      createDto.pricingPackage,
    );

    const basicPackage = this.gigPackageRepository.create(basic);
    const standardPackage = this.gigPackageRepository.create(standard);
    const premiumPackage = this.gigPackageRepository.create(premium);

    const createdEntity = this._repository.create({
      ...createDto,
      id: uuidv4(),
      freelancer,
      tags: createdTags,
      packages: [basicPackage, standardPackage, premiumPackage],
    });

    return await this._repository.save(createdEntity);
  }

  async update(
    id: BaseEntity['id'],
    data: DeepPartial<GigEntity>,
  ): Promise<GigEntity> {
    const gigEntity = await this.findOneById(id);

    if (data.tags) {
      data.tags = await this.createTags(data.tags);
    }

    const updateEntity: GigEntity = {
      ...gigEntity,
      category: undefined,
      subCategory: undefined,
      nestedSubcategory: undefined,
      ...data,
      ratingCount: gigEntity.ratingCount,
      viewCount: gigEntity.viewCount,
      orderCount: gigEntity.orderCount,
      freelancer: gigEntity.freelancer,
      users: gigEntity.users,
    } as any;

    const save = await super.create(updateEntity);

    return save;
  }

  async createTags(tags: any[]): Promise<any[]> {
    const tagNames = tags;

    const existingTags = await this.gigTagRepository.findBy({
      name: In(tagNames),
    });

    const newTagNames = tagNames.filter(
      (_) => !existingTags.some((__) => __.name === _),
    );
    const newTags = await Promise.all(
      newTagNames.map(async (name) => {
        const newskill = this.gigTagRepository.create({ name });
        return await this.gigTagRepository.save(newskill);
      }),
    );

    const allTags = [...existingTags, ...newTags];

    return allTags;
  }

  // protected modifyOptions(
  //   options: FindManyOptions<GigEntity>,
  //   currentUser?: JwtAccessPayloadType,
  // ): FindManyOptions<GigEntity> {
  //   const { where, ...anotherOptions } = options as any;
  //   const { day_range, ...anotherWheres } = where;

  //   let whereOptions;
  //   if (!Number.isNaN(Number.parseInt(day_range))) {
  //     const now = new Date();
  //     const manyDaysAgo = new Date();
  //     manyDaysAgo.setDate(manyDaysAgo.getDate() - Number(day_range));

  //     whereOptions = {
  //       ...anotherWheres,
  //       updatedAt: Between(manyDaysAgo, now),
  //     };
  //   } else if (day_range === 'All') {
  //     whereOptions = anotherWheres;
  //   }

  //   const finalOptions = {
  //     ...anotherOptions,
  //     where: whereOptions,
  //   };
  //   return finalOptions;
  // }

  async findOneBySlug(options: FindOneOptions<GigEntity>): Promise<GigEntity> {
    const entity = await this.findOne(options);

    entity.viewCount = entity.viewCount + 1;
    this._repository.save(entity);
    return entity;
  }

  protected additionalQuery(
    queryBuilder: SelectQueryBuilder<GigEntity>,
    appliedFilters: Set<string>,
    filters: Record<string, any>,
    sort: any,
    currentUser: any,
  ): SelectQueryBuilder<GigEntity> {
    if (Number(currentUser.role.id) === RoleEnum.ADMIN) {
      queryBuilder.leftJoinAndSelect(
        `${queryBuilder.alias}.freelancer`,
        'freelancer',
      );
    } else {
      queryBuilder
        .leftJoinAndSelect(`${queryBuilder.alias}.freelancer`, 'freelancer')
        .where('freelancer.id = :freelancerId', {
          freelancerId: currentUser.id,
        });
    }

    queryBuilder
      .leftJoin(`${queryBuilder.alias}.category`, 'category')
      .addSelect(['category.id', 'category.slug']);

    queryBuilder.leftJoinAndSelect(
      `${queryBuilder.alias}.subCategory`,
      'subCategory',
    );

    queryBuilder.leftJoinAndSelect(
      `${queryBuilder.alias}.nestedSubcategory`,
      'nestedSubcategory',
    );

    if (filters && Object.keys(filters).length > 0) {
      Object.entries(filters).forEach(([key, value]) => {
        const filterKey = key.trim().toLowerCase();
        const filterValue = String(value).trim();

        if (appliedFilters.has(filterKey)) return;

        if (filterKey === 'day_range') {
          const isNumber = isNumberParse(filterValue.replaceAll(`'`, ``));
          const dayRange = Number(filterValue);

          if (isNumber && dayRange > 0) {
            queryBuilder.andWhere(
              `${queryBuilder.alias}.updatedAt >= DATE_SUB(UTC_TIMESTAMP(), INTERVAL :dayRange DAY)`,
              { dayRange },
            );
          } else {
            console.error(`Invalid "day_range" filter value:`, filterValue);
          }

          appliedFilters.add(filterKey);
        }
      });
    }

    return queryBuilder;
  }

  transformPackages = (data) => {
    const types = ['basic', 'standard', 'premium'];

    const result = Object.values(GigPackageType).map((type) => {
      const obj: Partial<GigPackagesEntity> = {
        id: uuidv4(),
        type: type,
        title: '',
        description: '',
        price: 0,
        deliveryTime: 0,
        revisions: 0,
        features: [] as { package: string; value: string }[],
      };

      data.forEach((item) => {
        const value = item[type];

        switch (item.package.toLowerCase()) {
          case 'name':
            obj.title = value.replace(/[^\w ]/, '') ?? '';
            break;
          case 'description':
            obj.description = value.replace(/[^\w ]/, '') ?? '';
            break;
          case 'price':
            obj.price = Number(value ?? 0);
            break;
          case 'delivery':
            obj.deliveryTime = Number(value ?? 0);
            break;
          case 'delivery':
            obj.deliveryTime = Number(value ?? 0);
            break;
          case 'revisions':
            obj.revisions = Number(value ?? 0);
            break;
          default:
            obj.features = obj.features || [];
            obj.features.push({
              package: item.package,
              value: value !== undefined ? value.toString() : '',
            });
            break;
        }
      });

      return obj;
    });

    return result;
  };
}
