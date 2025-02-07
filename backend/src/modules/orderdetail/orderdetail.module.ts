import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderDetailEntity } from './entities/orderdetail.entity';
import { OrderDetailController } from './orderdetail.controller';
import { OrderDetailService } from './orderdetail.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderDetailEntity])],
  controllers: [OrderDetailController],
  providers: [OrderDetailService],
})
export class OrderdetailModule {}
