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
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([
      FreelancerEntity,
      SkillEntity,
      LanguageEntity,
      FreelancersLanguages,
      FreelancersSkills,
    ]),
  ],
  controllers: [FreelancerController],
  providers: [FreelancerService, UserService],
  exports: [FreelancerService],
})
export class FreelancerModule {}
