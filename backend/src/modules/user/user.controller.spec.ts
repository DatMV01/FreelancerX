import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DEFAULT_MAPPER_TOKEN } from '@automapper/nestjs';
import { UserEntity } from './entities/user.entity';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const createUserDto = {
    email: 'test@example.com',
    password: 'securepassword',
  };

  const createdUser = {
    id: 'user123',
    ...createUserDto,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const updateUserDto = {
    email: 'updated@example.com',
  };

  const updatedUser = {
    id: 'user123',
    ...updateUserDto,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUser: UserEntity = {
    id: 'user123',
    email: 'test@example.com',
    password: 'hashed',
    createdAt: new Date(),
    updatedAt: new Date(),
    freelancer: {
      id: 'freelancer123',
      userId: 'user123',
      bio: 'test bio',
      freelancersLanguages: [],
      freelancersSkills: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  } as any; // dùng as any nếu chưa khai báo đầy đủ các field

  const mockUserService = {
    findOne: jest.fn().mockResolvedValue(mockUser),
  } as any;

  const mockMapper = {
    map: jest.fn((source) => source),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: DEFAULT_MAPPER_TOKEN, useValue: mockMapper },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOneById', () => {
    it('should return mapped user dto with freelancer info', async () => {
      const result = await controller.findOneById('user123');

      expect(service.findOne).toHaveBeenCalledWith({
        where: { id: 'user123' },
        relations: [
          'freelancer',
          'freelancer.freelancersLanguages',
          'freelancer.freelancersSkills',
        ],
      });

      expect(result).toEqual(
        expect.objectContaining({
          id: 'user123',
          freelancer: expect.objectContaining({
            id: 'freelancer123',
            bio: 'test bio',
          }),
        }),
      );
    });
  });

  describe('create', () => {
    it('should create a user and return UserDto', async () => {
      mockUserService.create = jest.fn().mockResolvedValue(createdUser);

      const result = await controller.create(createUserDto as any);

      expect(mockUserService.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(
        expect.objectContaining({ id: 'user123', email: 'test@example.com' }),
      );
    });
  });

  describe('update', () => {
    it('should update a user and return updated UserDto', async () => {
      mockUserService.update = jest.fn().mockResolvedValue(updatedUser);

      const result = await controller.update('user123', updateUserDto as any);

      expect(mockUserService.update).toHaveBeenCalledWith(
        'user123',
        updateUserDto,
      );
      expect(result).toEqual(
        expect.objectContaining({
          id: 'user123',
          email: 'updated@example.com',
        }),
      );

      console.log('====================');
      console.log(updatedUser);
      console.log(result);
    });
  });
});
