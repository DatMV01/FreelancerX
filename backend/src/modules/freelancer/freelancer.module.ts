import { Module } from '@nestjs/common';
import { FreelancerController } from './freelancer.controller';
import { FreelancerService } from './freelancer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FreelancerEntity } from './entities/freelancer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FreelancerEntity])],
  controllers: [FreelancerController],
  providers: [FreelancerService],
})
export class SellerModule {}
