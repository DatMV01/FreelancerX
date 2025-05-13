import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { DataSource, Repository, UpdateResult } from 'typeorm';
import { WalletEntity } from '../wallet/entities/wallet.entity';
import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';

describe('UserService', () => {
  let service: UserService;
  let mockRepo: jest.Mocked<Repository<UserEntity>>;

  beforeEach(async () => {
    const initMockRepo = {
      findOne: jest.fn(),
      find: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
      preload: jest.fn(),
      softDelete: jest.fn(),
      delete: jest.fn(),
      restore: jest.fn(),
      findAndCount: jest.fn(),
      existsBy: jest.fn(),
      findOneOrFail: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      }),
    };

    const mockDataSource = {
      getRepository: jest.fn().mockReturnValue(initMockRepo),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: initMockRepo,
        },
        {
          provide: getRepositoryToken(WalletEntity),
          useValue: {
            find: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    mockRepo = module.get(getRepositoryToken(UserEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save an entity', async () => {
      const dto: Partial<UserEntity> = {
        email: faker.internet.email(),
        fullName: `${faker.person.firstName()}`,
        password: bcrypt.hashSync('user123', 10),
        avatar: faker.image.avatar(),
        country: faker.location.country(),
        phone: faker.phone.number(),
        roleId: 2,
        statusId: 1,
      };
      const id = crypto.randomUUID();
      const entity: Partial<UserEntity> = { id, ...dto };

      mockRepo.create.mockReturnValue(entity as any);
      mockRepo.save.mockResolvedValue(entity as any);

      const result = await service.create(dto);

      expect(result).toEqual(entity);
      expect(mockRepo.create).toHaveBeenCalledWith(dto);
      expect(mockRepo.save).toHaveBeenCalledWith(entity);
    });
  });

  describe('findOneById', () => {
    it('should return entity when found', async () => {
      const dto: Partial<UserEntity> = {
        email: faker.internet.email(),
        fullName: `${faker.person.firstName()}`,
        password: bcrypt.hashSync('user123', 10),
        avatar: faker.image.avatar(),
        country: faker.location.country(),
        phone: faker.phone.number(),
        roleId: 2,
        statusId: 1,
      };
      const id = crypto.randomUUID();
      const entity: Partial<UserEntity> = { id, ...dto } as any;
      mockRepo.findOne.mockResolvedValue(entity as any);

      const result = await service.findOneById(1);
      expect(result).toEqual(entity);

      expect(mockRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException ìf not found', async () => {
      const notFoundException = new NotFoundException('Not found');

      mockRepo.findOne.mockRejectedValue(notFoundException);

      await expect(service.findOneById(999)).rejects.toThrow(NotFoundException);

      await expect(service.findOneById(999)).rejects.toThrow(
        notFoundException.message,
      );
    });
  });

  describe('update', () => {
    it('should update entity and return updated entity', async () => {
      const dto: Partial<UserEntity> = {
        email: faker.internet.email(),
        fullName: `${faker.person.firstName()}`,
        password: bcrypt.hashSync('user123', 10),
        avatar: faker.image.avatar(),
        country: faker.location.country(),
        phone: faker.phone.number(),
        roleId: 2,
        statusId: 1,
      };

      const id = crypto.randomUUID();
      const entity: Partial<UserEntity> = { id, ...dto };

      const savedUser: Partial<UserEntity> = {
        ...entity,
        password: bcrypt.hashSync('user123456', 10),
      };

      mockRepo.findOne.mockResolvedValue(entity as any);
      mockRepo.save.mockResolvedValue(savedUser as any);
      // jest.spyOn(bcrypt, 'compareSync').mockReturnValue(false);
      // jest.spyOn(bcrypt, 'hashSync').mockReturnValue('hashedPassword');

      const result = await service.update(1, dto as any);
      expect(result).toEqual(savedUser);
    });

    it('should throw NotFoundException if not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      const id = crypto.randomUUID();

      await expect(service.update(id, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeOneById', () => {
    it('should soft delete by id', async () => {
      mockRepo.softDelete.mockResolvedValue(createUpdateResult(1));

      const result = await service.removeSoftOneById(1);
      expect(result).toBe(true);
    });

    it('should throw if soft delete fails', async () => {
      mockRepo.softDelete.mockResolvedValue(createUpdateResult(0));

      await expect(
        service.removeSoftOneById(crypto.randomUUID()),
      ).rejects.toThrow(NotFoundException);
    });

    it('should hard delete by id', async () => {
      mockRepo.delete.mockResolvedValue(createUpdateResult(1));

      const result = await service.removeHardOneById(crypto.randomUUID());
      expect(result).toBe(true);
    });

    it('should throw if hard delete fails', async () => {
      mockRepo.delete.mockResolvedValueOnce({ affected: 0 } as any);
      await expect(
        service.removeHardOneById(crypto.randomUUID()),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('restore ', () => {
    it('should restore a soft-deleted entity', async () => {
      mockRepo.restore.mockResolvedValue(createUpdateResult(1));

      await expect(service.restore(1)).resolves.not.toThrow();
    });

    it('should throw if restore fails', async () => {
      mockRepo.restore.mockResolvedValue(createUpdateResult(0));
      await expect(service.restore(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('existsBy ', () => {
    it('should return true if entity exists', async () => {
      mockRepo.existsBy.mockResolvedValueOnce(true);
      const result = await service.existsBy({ id: crypto.randomUUID() });
      expect(result).toBe(true);
    });

    it('should throw if entity exists', async () => {
      mockRepo.existsBy.mockResolvedValueOnce(true);
      await expect(
        service.existsByAndThrowExeption({ id: crypto.randomUUID() }),
      ).rejects.toThrow(UnprocessableEntityException);
    });

    it('should return false if entity does not exist', async () => {
      mockRepo.existsBy.mockResolvedValueOnce(false);
      const result = await service.existsByAndThrowExeption({
        id: crypto.randomUUID(),
      });
      expect(result).toBe(false);
    });
  });

  describe('findAll', () => {
    it('should find all with pagination', async () => {
      const dto: Partial<UserEntity> = {
        email: faker.internet.email(),
        fullName: `${faker.person.firstName()}`,
        password: bcrypt.hashSync('user123', 10),
        avatar: faker.image.avatar(),
        country: faker.location.country(),
        phone: faker.phone.number(),
        roleId: 2,
        statusId: 1,
      };

      const id = crypto.randomUUID();
      const entity: Partial<UserEntity> = { id, ...dto };
      const userStub = entity as any;
      mockRepo.findAndCount.mockResolvedValueOnce([[userStub], 1]);

      const result = await service.findAll2({
        page: 1,
        pageSize: 10,
        filters: {},
        sorts: {},
        fields: [],
      });

      expect(mockRepo.findAndCount).toHaveBeenCalled();
      expect(result).toEqual([[userStub], 1]);
    });
  });
});

function createUpdateResult(affected: number = 1): UpdateResult {
  return {
    raw: {},
    generatedMaps: [],
    affected,
  };
}
