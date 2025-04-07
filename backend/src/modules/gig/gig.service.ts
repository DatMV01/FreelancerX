import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeepPartial,
  In,
  ObjectLiteral,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { BaseService } from '../base/base.service';
import { GigEntity, GigTagEntity } from './entities/gig.entity';
import { isNumberParse } from 'src/utils/common';
import { RoleEnum } from '../role/enum/role.enum';
import { FreelancerService } from '../freelancer/freelancer.service';
import { v4 as uuidv4 } from 'uuid';
import { BaseEntity } from '../base/entities/base.entity';

@Injectable()
export class GigService extends BaseService<GigEntity> {
  constructor(
    @InjectRepository(GigEntity)
    private readonly _repository: Repository<GigEntity>,

    @InjectRepository(GigTagEntity)
    private readonly gigTagRepository: Repository<GigTagEntity>,

    private readonly freelancerService: FreelancerService,
  ) {
    super(_repository);
  }

  async create(createDto: DeepPartial<GigEntity>): Promise<GigEntity> {
    const freelancer = await this.freelancerService.findOne({
      where: { userId: createDto.userId },
    });

    const createdTags = await this.createTags(createDto.tags || []);

    const createdEntity = this._repository.create({
      ...createDto,
      id: uuidv4(),
      freelancer,
      tags: createdTags,
    });

    return await this._repository.save(createdEntity);
  }

  async update(
    id: BaseEntity['id'],
    data: DeepPartial<GigEntity>,
  ): Promise<GigEntity> {
  //  const gigEntity = await this.findOneById(id);

    const createdTags = await this.createTags(data.tags || []);

    data.tags = createdTags;
    data.category = undefined;
    data.subCategory = undefined;
    data.nestedSubcategory = undefined;

    const save = await super.create(data);

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
}
