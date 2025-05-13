import { Test, TestingModule } from '@nestjs/testing';
import { RoleService } from './role.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { RoleEntity } from './entities/role.entity';

describe('RoleService', () => {
  let service: RoleService;
  let repo: jest.Mocked<Partial<Repository<RoleEntity>>>;

  beforeEach(async () => {
    const mockRepo = {
      find: jest.fn().mockResolvedValue([{ id: 1, name: 'Admin' }]),
      findAndCount: jest.fn().mockResolvedValue([{ id: 1, name: 'Admin' }]),
      findOne: jest.fn(),
      save: jest.fn(),
    };
    const mockDataSource = {
      getRepository: jest.fn().mockReturnValue(mockRepo),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: getRepositoryToken(RoleEntity),
          useValue: mockRepo,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<RoleService>(RoleService);
    repo = module.get(getRepositoryToken(RoleEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
