import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  DeepPartial,
  FindManyOptions,
  FindOptionsWhere,
  In,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { BaseService } from '../base/base.service';
import { FreelancerEntity } from './entities/freelancer.entity';
import {
  FreelancersSkills,
  SkillEntity,
} from './entities/freelancers_skills.entity';
import { BaseEntity } from '../base/entities/base.entity';
import { consoleError } from 'src/utils/common';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import {
  FreelancersLanguages,
  LanguageEntity,
} from './entities/freelancers_languages.entity';
import { RoleEnum } from '../role/enum/role.enum';
import { JwtAccessPayloadType } from '../auth/strategies/types/jwt-access-payload.type';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FreelancerService extends BaseService<FreelancerEntity> {
  constructor(
    @InjectRepository(FreelancerEntity)
    private readonly _repository: Repository<FreelancerEntity>,

    @InjectRepository(SkillEntity)
    private readonly skillRepository: Repository<SkillEntity>,

    @InjectRepository(FreelancersSkills)
    private readonly freelancersSkillsRepository: Repository<FreelancersSkills>,

    @InjectRepository(FreelancersLanguages)
    private readonly freelancersLangaguesRepository: Repository<FreelancersLanguages>,

    @InjectRepository(LanguageEntity)
    private readonly languageRepository: Repository<LanguageEntity>,

    private readonly userService: UserService,
  ) {
    super(_repository);
  }

  async create(
    createDto: DeepPartial<FreelancerEntity>,
  ): Promise<FreelancerEntity> {
    const queryRunner = this.dataSource.createQueryRunner();

    const { userId, email, skills, languages, avatar, phone, country } =
      createDto;

    const whereCondition: any[] = [];
    if (userId) whereCondition.push({ id: userId });
    if (email) whereCondition.push({ email });

    // Check if the user exists
    const userEnity = await this.userService.findOne({
      select: {
        id: true,
        email: true,
        avatar: true,
        phone: true,
        country: true,
      },
      where: whereCondition,
    });

    if (!userEnity) {
      throw new NotFoundException('User not found');
    }

    userEnity.avatar = avatar ?? userEnity.avatar;
    userEnity.phone = phone ?? userEnity.phone;
    userEnity.country = country ?? userEnity.country;

    await queryRunner.connect();
    await queryRunner.startTransaction();

    const allSkills = await this.createSkills(queryRunner, skills || []);
    const allLanguages = await this.createLanguages(languages || []);

    try {
      const createdFreelancer = queryRunner.manager.create(FreelancerEntity, {
        ...createDto,
        user: userEnity,
        id: uuidv4(),
      });

      const createdFreelancerSkills = allSkills.map((skill) =>
        queryRunner.manager.create(FreelancersSkills, {
          freelancerId: createdFreelancer.id,
          skill,
          proficiency: skill.proficiency,
        }),
      );

      const createdFreelancerLanguages = allLanguages.map((language) =>
        queryRunner.manager.create(FreelancersLanguages, {
          freelancerId: createdFreelancer.id,
          language,
          proficiency: language.proficiency,
        }),
      );

      await queryRunner.manager.save(createdFreelancer);
      await queryRunner.manager.save(createdFreelancerSkills);
      await queryRunner.manager.save(createdFreelancerLanguages);

      await queryRunner.manager.update(UserEntity, userEnity.id, userEnity);
      await queryRunner.commitTransaction();

      const freelancerEntity = await super.findOneById(createdFreelancer.id);
      return freelancerEntity;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async update(
    id: BaseEntity['id'],
    data: DeepPartial<FreelancerEntity>,
  ): Promise<FreelancerEntity> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Find the existing freelancer entity
      const freelancerEntity = await this.findOneById(id);

      const { skills, languages, level, email, avatar, phone, country } = data;

      await queryRunner.manager.delete(FreelancersSkills, { freelancerId: id });
      await queryRunner.manager.delete(FreelancersLanguages, {
        freelancerId: id,
      });

      // Update the freelancer entity
      const updatedFreelancerEntity: FreelancerEntity = {
        ...freelancerEntity,
        ...data,
        userId: freelancerEntity.userId,
        id: freelancerEntity.id,
        email: freelancerEntity.email,
        level: level || freelancerEntity.level,
      } as any;

      await queryRunner.manager.save(FreelancerEntity, updatedFreelancerEntity);

      // Update related skills
      const allSkills = await this.createSkills(queryRunner, skills || []);
      const createdFreelancerSkills = allSkills.map((skill) =>
        queryRunner.manager.create(FreelancersSkills, {
          freelancerId: freelancerEntity.id,
          skill,
          proficiency: skill.proficiency,
        }),
      );

      // Update related languages
      const allLanguages = await this.createLanguages(languages || []);
      const createdFreelancerLanguages = allLanguages.map((language) =>
        queryRunner.manager.create(FreelancersLanguages, {
          freelancerId: freelancerEntity.id,
          language,
          proficiency: language.proficiency,
        }),
      );

      // Delete existing relationships
      await queryRunner.manager.delete(FreelancersSkills, {
        freelancerId: freelancerEntity.id,
      });
      await queryRunner.manager.delete(FreelancersLanguages, {
        freelancerId: freelancerEntity.id,
      });

      // Save new relationships
      await queryRunner.manager.save(createdFreelancerSkills);
      await queryRunner.manager.save(createdFreelancerLanguages);

      // Commit the transaction
      await queryRunner.commitTransaction();

      // Return the updated freelancer entity
      const result = await super.findOneById(id);
      return result;
    } catch (error) {
      // Rollback the transaction in case of an error
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Release the query runner
      await queryRunner.release();
    }
  }

  async update3(
    id: BaseEntity['id'],
    data: DeepPartial<FreelancerEntity>,
  ): Promise<FreelancerEntity> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const freelancerEntity = await this.findOneById(id);

    const { skills, languages, email, avatar, phone, country } = data;

    try {
      // Tạo các kỹ năng và ngôn ngữ mới nếu có
      const allSkills = await this.createSkills(queryRunner, skills || []);
      const allLanguages = await this.createLanguages(languages || []);

      // Tạo các bản ghi FreelancersSkills mới
      const createdFreelancerSkills = allSkills.map((skill) =>
        queryRunner.manager.create(FreelancersSkills, {
          freelancerId: freelancerEntity.id,
          skill,
          proficiency: skill.proficiency,
        }),
      );

      // Tạo các bản ghi FreelancersLanguages mới
      const createdFreelancerLanguages = allLanguages.map((language) =>
        queryRunner.manager.create(FreelancersLanguages, {
          freelancerId: freelancerEntity.id,
          language,
          proficiency: language.proficiency,
        }),
      );

      await queryRunner.manager.delete(FreelancersSkills, {
        freelancerId: freelancerEntity.id,
      });
      await queryRunner.manager.delete(FreelancersLanguages, {
        freelancerId: freelancerEntity.id,
      });
      const savedFreelancerSkills = await queryRunner.manager.save(
        createdFreelancerSkills,
      );
      const savedFreelancerLanguages = await queryRunner.manager.save(
        createdFreelancerLanguages,
      );
      Object.assign(freelancerEntity, {
        ...data,
        //   freelancersSkills: savedFreelancerSkills,
        //     freelancersLanguages: savedFreelancerLanguages,
      });
      await queryRunner.manager.update(
        FreelancerEntity,
        freelancerEntity.id,
        freelancerEntity,
      );

      // await queryRunner.manager.delete(FreelancersSkills, {
      //   freelancerId: freelancerEntity.id,
      // });
      // await queryRunner.manager.delete(FreelancersLanguages, {
      //   freelancerId: freelancerEntity.id,
      // });

      // Object.assign(freelancerEntity, {
      //   ...data,
      //   freelancersSkills: createdFreelancerSkills,
      //   freelancersLanguages: createdFreelancerLanguages,
      // });
      // await queryRunner.manager.update(
      //   FreelancerEntity,
      //   freelancerEntity.id,
      //   freelancerEntity,
      // );

      await queryRunner.commitTransaction();

      const result = await super.findOneById(id);

      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
  async update2(
    id: BaseEntity['id'],
    data: DeepPartial<FreelancerEntity>,
  ): Promise<FreelancerEntity> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const freelancerEntity = await this.findOneById(id);

    const { skills, languages, email, avatar, phone, country } = data;

    try {
      // Tạo các kỹ năng và ngôn ngữ mới nếu có
      const allSkills = await this.createSkills(queryRunner, skills || []);
      const allLanguages = await this.createLanguages(languages || []);

      // Xóa các kỹ năng và ngôn ngữ của freelancer hiện tại
      await queryRunner.manager.delete(FreelancersSkills, {
        freelancerId: freelancerEntity.id,
      });
      await queryRunner.manager.delete(FreelancersLanguages, {
        freelancerId: freelancerEntity.id,
      });

      // Tạo các bản ghi FreelancersSkills mới
      const createdFreelancerSkills = allSkills.map((skill) =>
        queryRunner.manager.create(FreelancersSkills, {
          freelancerId: freelancerEntity.id,
          skill,
          proficiency: skill.proficiency,
        }),
      );
      const abc = await queryRunner.manager.save(createdFreelancerSkills);

      // Tạo các bản ghi FreelancersLanguages mới
      const createdFreelancerLanguages = allLanguages.map((language) =>
        queryRunner.manager.create(FreelancersLanguages, {
          freelancerId: freelancerEntity.id,
          language,
          proficiency: language.proficiency,
        }),
      );

      // Cập nhật thông tin của freelancer

      Object.assign(freelancerEntity, {
        ...data,
        freelancersSkills: abc,
        freelancersLanguages: createdFreelancerSkills,
      });
      // Lưu lại freelancer entity

      await queryRunner.manager.save(FreelancerEntity, freelancerEntity);

      await queryRunner.commitTransaction();

      const result = await super.findOneById(id);

      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async createSkills(queryRunner: QueryRunner, skills: any[]): Promise<any[]> {
    const skillNames = skills?.map((_) => _.name);

    const existingSkills = await queryRunner.manager.findBy(SkillEntity, {
      name: In(skillNames),
    });

    const newSkillNames = skillNames.filter(
      (title) => !existingSkills.some((skill) => skill.name === title),
    );
    const newSkills = await Promise.all(
      newSkillNames.map(async (name) => {
        const newskill = queryRunner.manager.create(SkillEntity, { name });
        return await queryRunner.manager.save(newskill);
      }),
    );

    const allSkills = [...existingSkills, ...newSkills];

    const result = allSkills.map((skill) => {
      const proficiencyMatch = skills.find((s) => s.name === skill.name);
      return {
        ...skill,
        proficiency: proficiencyMatch ? proficiencyMatch.proficiency : null,
      };
    });

    return result;
  }

  async createLanguages(languages: any[]) {
    const languageNames = languages.map((_) => _.name);
    const existingLanguages = await this.languageRepository.findBy({
      name: In(languageNames),
    });

    const allLanguges = [...existingLanguages];

    const result = allLanguges.map((langages) => {
      const proficiencyMatch = languages.find((s) => s.name === langages.name);
      return {
        ...langages,
        proficiency: proficiencyMatch ? proficiencyMatch.proficiency : null,
      };
    });

    return result;
  }

  protected additionalQuery(
    queryBuilder: SelectQueryBuilder<FreelancerEntity>,
    appliedFilters: Set<string>,
    filters: any,
    sort: any,
    currentUser: any,
  ): SelectQueryBuilder<FreelancerEntity> {
    if (Number(currentUser.role.id) === RoleEnum.ADMIN) {
      queryBuilder
        .leftJoinAndSelect(`${queryBuilder.alias}.skills`, 'skills')
        .leftJoinAndSelect(`${queryBuilder.alias}.languages`, 'languages');
    } else {
      queryBuilder
        .leftJoinAndSelect(`${queryBuilder.alias}.skills`, 'skills')
        .leftJoinAndSelect(`${queryBuilder.alias}.languages`, 'languages')
        .where(`${queryBuilder.alias}.userId = :userId`, {
          userId: currentUser.id,
        });
    }

    return queryBuilder;
  }

  protected modifyOptions(
    options: FindManyOptions<FreelancerEntity>,
    currentUser?: JwtAccessPayloadType,
  ): FindManyOptions<FreelancerEntity> {
    if (currentUser?.role !== RoleEnum[RoleEnum.ADMIN]) {
      options.where = { ...options.where, userId: currentUser?.id };
    }
    return options;
  }
}
