import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutoMapper } from 'src/modules/base/mapper/mapper';
import { FreelancerModule } from '../freelancer/freelancer.module';
import { UserModule } from '../user/user.module';
import { GigEntity, GigTagEntity } from './entities/gig.entity';
import { GigController } from './gig.controller';
import { GigService } from './gig.service';
import { PackageEntity } from './entities/package.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([GigEntity, GigTagEntity, PackageEntity]),
    UserModule,
    FreelancerModule,
  ],
  controllers: [GigController],
  providers: [GigService, AutoMapper],
})
export class GigModule {}
