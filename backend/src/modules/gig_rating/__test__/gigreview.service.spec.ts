import { Test, TestingModule } from '@nestjs/testing';
import { GigReviewService } from '../gigreview.service';

describe('RatingService', () => {
  let service: GigReviewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GigReviewService],
    }).compile();

    service = module.get<GigReviewService>(GigReviewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
