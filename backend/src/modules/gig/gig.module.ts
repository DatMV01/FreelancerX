import { Module } from '@nestjs/common';
import { GigService } from './gig.service';
import { GigController } from './gig.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GigEntity } from './entities/gig.entity';
import { AutoMapper } from 'src/modules/base/mapper/mapper';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([GigEntity]), UsersModule],
  controllers: [GigController],
  providers: [GigService, AutoMapper],
})
export class GigModule {}
