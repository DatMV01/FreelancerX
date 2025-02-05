import { Test, TestingModule } from '@nestjs/testing';
import { FilesLocalService } from '../files.service';

describe('FilesService', () => {
  let service: FilesLocalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FilesLocalService],
    }).compile();

    service = module.get<FilesLocalService>(FilesLocalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
