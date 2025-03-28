import { Module } from '@nestjs/common';
import { FreelancerController } from './freelancer.controller';
import { FreelancerService } from './freelancer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FreelancerEntity } from './entities/freelancer.entity';
import {
  FreelancerSkillEntity,
  FreelancersSkills,
} from './entities/freelancers_skills.entity';
import {
  FreelancerLanguageEntity,
  FreelancersLanguages,
} from './entities/freelancers_languages.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FreelancerEntity,
      FreelancerSkillEntity,
      FreelancerLanguageEntity,
      FreelancersLanguages,
      FreelancersSkills,
    ]),
  ],
  controllers: [FreelancerController],
  providers: [FreelancerService],
})
export class SellerModule {}
