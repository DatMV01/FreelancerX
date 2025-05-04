import { Module } from '@nestjs/common';
import { SupportService } from './support.service';
import { SupportController } from './support.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupportEntity } from './entities/support.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SupportEntity])],
  controllers: [SupportController],
  providers: [SupportService],
})
export class SupportModule {}
