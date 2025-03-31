import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { categories } from 'data/categories';
import { CategoryEntity } from 'src/modules/category/entities/category.entity';
import { DeepPartial, Repository } from 'typeorm';

@Injectable()
export class CategorySeeding {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly repository: Repository<CategoryEntity>,
  ) {}

  async run() {
    await this.repository.query('SET FOREIGN_KEY_CHECKS=0;');
    await this.repository.clear();
    await this.repository.query('SET FOREIGN_KEY_CHECKS=1;');

    const _categories: DeepPartial<CategoryEntity>[] = categories as any;

    await this.repository.save(_categories);

    console.log('Seeded Categories!');
  }
}
