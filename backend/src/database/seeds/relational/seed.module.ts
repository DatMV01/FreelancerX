import { Module } from '@nestjs/common';
import { TypeORMModule } from 'src/database/typeorm/typeorm.module';
import { RoleSeedModule } from './role/role.seed.module';

@Module({
  imports: [TypeORMModule, RoleSeedModule],
})
export class SeedModule {}
