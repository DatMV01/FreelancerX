import { Test, TestingModule } from '@nestjs/testing';
import { OrderDetailController } from '../orderdetail.controller';
import { OrderdetailService } from '../orderdetail.service';

describe('OrderdetailController', () => {
  let controller: OrderDetailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderDetailController],
      providers: [OrderdetailService],
    }).compile();

    controller = module.get<OrderDetailController>(OrderDetailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
