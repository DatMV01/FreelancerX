import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm';
import { BaseService } from '../base/base.service';
import { GigEntity } from './entities/gig.entity';
import { isNumberParse } from 'src/utils/common';

@Injectable()
export class GigService extends BaseService<GigEntity> {
  constructor(
    @InjectRepository(GigEntity)
    private readonly _repository: Repository<GigEntity>,
  ) {
    super(_repository);
  }

  protected additionalQuery(
    queryBuilder: SelectQueryBuilder<GigEntity>,
    appliedFilters: Set<string>,
    filters: Record<string, any>,
    sort: any,
  ): SelectQueryBuilder<GigEntity> {
    if (!filters || Object.keys(filters).length === 0) {
      console.warn('No filters provided or empty object:', filters);
      return queryBuilder;
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

    return queryBuilder;
  }
}
