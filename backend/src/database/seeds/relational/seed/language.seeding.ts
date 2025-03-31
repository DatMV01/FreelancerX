import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { languages } from 'data/languages';
import { LanguageEntity } from 'src/modules/freelancer/entities/freelancers_languages.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LanguageSeeding {
  constructor(
    @InjectRepository(LanguageEntity)
    private readonly repository: Repository<LanguageEntity>,
  ) {}

  async run() {
    await this.repository.query('SET FOREIGN_KEY_CHECKS=0;');
    await this.repository.clear();
    await this.repository.query('SET FOREIGN_KEY_CHECKS=1;');

    const _languages: Partial<LanguageEntity>[] = languages as any;

    await this.repository.save(_languages);

    console.log('\n == Languages are seeded completely !!! == \n');
  }
}
