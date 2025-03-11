import { Module } from '@nestjs/common';
import { GigService } from './gig.service';
import { GigController } from './gig.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GigEntity } from './entities/gig.entity';
import { AutoMapper } from 'src/common/mapper/mapper';

@Module({
  imports: [TypeOrmModule.forFeature([GigEntity])],
  controllers: [GigController],
  providers: [GigService, AutoMapper],
})
export class GigModule {}
