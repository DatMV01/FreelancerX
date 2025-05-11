import { Module } from '@nestjs/common';
import { TypeORMModule } from 'src/database/typeorm/typeorm.module';
import { RoleEntity } from 'src/modules/role/entities/role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleSeeding } from './seed/role.seeding';
import { StatusEntity } from 'src/modules/status/entities/status.entity';
import { StatusSeeding } from './seed/status.seeding';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { UserSeeding } from './seed/user.seeding';
import { CategorySeeding } from './seed/category.seeding';
import { CategoryEntity } from 'src/modules/category/entities/category.entity';
import { SkillEntity } from 'src/modules/freelancer/entities/freelancer_skills.entity';
import { SkillSeeding } from './seed/skill.seeding';
import { LanguageSeeding } from './seed/language.seeding';
import { LanguageEntity } from 'src/modules/freelancer/entities/freelancer_languages.entity';
import { FreelancerEntity } from 'src/modules/freelancer/entities/freelancer.entity';
import { WalletEntity } from 'src/modules/wallet/entities/wallet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity])],
  providers: [RoleSeeding],
  exports: [RoleSeeding],
})
export class RoleSeedModule {}

@Module({
  imports: [TypeOrmModule.forFeature([StatusEntity])],
  providers: [StatusSeeding],
  exports: [StatusSeeding],
})
export class StatusSeedModule {}

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, FreelancerEntity, WalletEntity]),
  ],
  providers: [UserSeeding],
  exports: [UserSeeding],
})
export class UserSeedModule {}

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity])],
  providers: [CategorySeeding],
  exports: [CategorySeeding],
})
export class CategorySeedModule {}

@Module({
  imports: [TypeOrmModule.forFeature([SkillEntity])],
  providers: [SkillSeeding],
  exports: [SkillSeeding],
})
export class SkillSeedModule {}

@Module({
  imports: [TypeOrmModule.forFeature([LanguageEntity])],
  providers: [LanguageSeeding],
  exports: [LanguageSeeding],
})
export class LanguageSeedModule {}

@Module({
  imports: [
    TypeORMModule,
    RoleSeedModule,
    StatusSeedModule,
    UserSeedModule,
    CategorySeedModule,
    SkillSeedModule,
    LanguageSeedModule,
  ],
})
export class SeedModule {}
