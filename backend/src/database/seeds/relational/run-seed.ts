import { NestFactory } from '@nestjs/core';
import { RoleSeeding } from './seed/role.seeding';
import { SeedModule } from './seed.module';
import { StatusSeeding } from './seed/status.seeding';
import { UserSeeding } from './seed/user.seeding';
import { CategorySeeding } from './seed/category.seeding';

const runSeed = async () => {
  const app = await NestFactory.create(SeedModule);

  await app.get(RoleSeeding).run();
  await app.get(StatusSeeding).run();
  await app.get(UserSeeding).run();
  await app.get(CategorySeeding).run();

  await app.close();
};

void runSeed();
