import { Module } from '@nestjs/common';
import { FreelancerController } from './freelancer.controller';
import { FreelancerService } from './freelancer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FreelancerEntity } from './entities/freelancer.entity';
import {
  SkillEntity,
  FreelancersSkills,
} from './entities/freelancers_skills.entity';
import {
  LanguageEntity,
  FreelancersLanguages,
} from './entities/freelancers_languages.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FreelancerEntity,
      SkillEntity,
      LanguageEntity,
      FreelancersLanguages,
      FreelancersSkills,
    ]),
  ],
  controllers: [FreelancerController],
  providers: [FreelancerService],
})
export class SellerModule {}
