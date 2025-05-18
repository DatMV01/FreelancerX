import { Test, TestingModule } from '@nestjs/testing';
import { GigReviewController } from '../gigreview.controller';
import { GigReviewService } from '../gigreview.service';

describe('RatingController', () => {
  let controller: GigReviewController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GigReviewController],
      providers: [GigReviewService],
    }).compile();

    controller = module.get<GigReviewController>(GigReviewController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
