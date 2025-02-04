import { Global, Module } from '@nestjs/common';
import { TypeORMModule } from './typeorm/typeorm.module';

@Global()
@Module({
  imports: [TypeORMModule],
  exports: [TypeORMModule],
})
export class DataBaseModule {}
