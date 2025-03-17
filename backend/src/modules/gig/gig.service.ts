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
    filters: any,
    sort: any,
  ): SelectQueryBuilder<GigEntity> {
    Object.keys(filters).forEach((key) => {
      if (appliedFilters.has(key)) return;

      const value = String(filters[key]).trim();
      if (String(key).trim().toLowerCase() === 'day_range') {
        const isNumber = isNumberParse(value.replaceAll(`'`, ``));
        if (isNumber) {
          queryBuilder.andWhere(
            `${queryBuilder.alias}.updatedAt >= DATE_SUB(NOW(), INTERVAL ${value} DAY)`,
          );
        }
        appliedFilters.add(key);
      }
    });

    return queryBuilder;
  }
}
