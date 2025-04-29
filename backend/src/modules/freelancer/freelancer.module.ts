import { Module } from '@nestjs/common';
import { FreelancerController } from './freelancer.controller';
import { FreelancerService } from './freelancer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FreelancerEntity } from './entities/freelancer.entity';
import {
  SkillEntity,
  FreelancersSkills,
} from './entities/freelancer_skills.entity';
import {
  LanguageEntity,
  FreelancersLanguages,
} from './entities/freelancer_languages.entity';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { FreelancerAnalyticsEntity } from './entities/freelancer_analytics.entity';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([
      FreelancerEntity,
      SkillEntity,
      LanguageEntity,
      FreelancersLanguages,
      FreelancersSkills,
     // FreelancerAnalyticsEntity,
    ]),
  ],
  controllers: [FreelancerController],
  providers: [FreelancerService, UserService],
  exports: [FreelancerService],
})
export class FreelancerModule {}
