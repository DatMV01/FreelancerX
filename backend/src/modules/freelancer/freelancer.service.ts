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
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const { id, email, skills, languages } = createDto;

    const whereCondition: any[] = [];
    if (id) whereCondition.push({ id });
    if (email) whereCondition.push({ email });

    const userEnity = await this.userService.findOne({
      select: { id: true, email: true },
      where: whereCondition,
    });

    userEnity && (await super.existsByAndThrowExeption(whereCondition));

    const allSkills = await this.createSkills(queryRunner, skills as string[]);
    const allLangueges = await this.createLanguages(languages as string[]);

    try {
      const newUser = this._repository.create({
        ...createDto,
        user: userEnity,
        languages: null,
        skills: null,
      } as any as FreelancerEntity);

      const savedUser = await queryRunner.manager.save(newUser);

      const userSkills = allSkills.map((skill) =>
        queryRunner.manager.create(FreelancersSkills, {
          freelancerId: savedUser.id,
          skill,
        }),
      );
      await queryRunner.manager.save(userSkills);

      const userLanguages = allLangueges.map((language) =>
        queryRunner.manager.create(FreelancersLanguages, {
          freelancerId: savedUser.id,
          language,
        }),
      );
      await queryRunner.manager.save(userLanguages);

      await queryRunner.commitTransaction();

      return super.findOneById(savedUser.id);
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

    const entity = await this.findOneById(id);

    const { email, skills, languages } = data;

    try {
      const updatedFreelancer = queryRunner.manager.create(FreelancerEntity, {
        ...entity,
        ...data,
        languages: null,
        skills: null,
      } as any);
      await queryRunner.manager.save(updatedFreelancer);

      const allSkills = await this.createSkills(
        queryRunner,
        skills as string[],
      );
      await queryRunner.manager.delete(FreelancersSkills, { freelancerId: id });
      const userSkills = allSkills.map((skill) =>
        queryRunner.manager.create(FreelancersSkills, {
          freelancerId: entity.id,
          skill,
        }),
      );
      await queryRunner.manager.save(userSkills);

      const allLangueges = await this.createLanguages(languages as string[]);
      await queryRunner.manager.delete(FreelancersLanguages, {
        freelancerId: id,
      });
      const userLanguages = allLangueges.map((language) =>
        queryRunner.manager.create(FreelancersLanguages, {
          freelancerId: entity.id,
          language,
        }),
      );
      await queryRunner.manager.save(userLanguages);

      await queryRunner.commitTransaction();

      return super.findOneById(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async createSkills(
    queryRunner: QueryRunner,
    skillNames: string[],
  ): Promise<SkillEntity[]> {
    const existingSkills = await queryRunner.manager.findBy(SkillEntity, {
      title: In(skillNames),
    });

    const newSkillNames = skillNames.filter(
      (title) => !existingSkills.some((skill) => skill.title === title),
    );
    const newSkills = await Promise.all(
      newSkillNames.map(async (title) => {
        const newskill = queryRunner.manager.create(SkillEntity, { title });
        return await queryRunner.manager.save(newskill);
      }),
    );

    const allSkills = [...existingSkills, ...newSkills];

    return allSkills;
  }

  async createLanguages(langages: string[]) {
    const existingLanguages = await this.languageRepository.findBy({
      name: In(langages),
    });

    const allLanguges = [...existingLanguages];

    return allLanguges;
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
