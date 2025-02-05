import { Module } from '@nestjs/common';
import { TypeORMModule } from 'src/database/typeorm/typeorm.module';
import { RoleSeedModule } from './role/role.seed.module';
import { StatusSeedModule } from './status/status.seed.module';

@Module({
  imports: [TypeORMModule, RoleSeedModule, StatusSeedModule],
})
export class SeedModule {}
