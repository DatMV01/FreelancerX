import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionController } from './controller/session.controller';
import { SessionEntity } from './entities/session.entity';
import { SessionService } from './service/session.service';

@Module({
  imports: [TypeOrmModule.forFeature([SessionEntity])],
  controllers: [SessionController],
  providers: [SessionService],
  exports: [SessionService, TypeOrmModule.forFeature([SessionEntity])],
})
export class SessionModule {}
