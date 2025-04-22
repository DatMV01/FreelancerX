import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { skills } from 'data/skill';
import { SkillEntity } from 'src/modules/freelancer/entities/freelancer_skills.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SkillSeeding {
  constructor(
    @InjectRepository(SkillEntity)
    private readonly repository: Repository<SkillEntity>,
  ) {}

  async run() {
    await this.repository.query('SET FOREIGN_KEY_CHECKS=0;');
    await this.repository.clear();
    await this.repository.query('SET FOREIGN_KEY_CHECKS=1;');

    const _skills: Partial<SkillEntity>[] = skills as any;

    await this.repository.save(_skills);

    console.log('\n == Skills are seeded completely !!! == \n');
  }
}
