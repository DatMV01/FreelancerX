import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { RoleEnum } from 'src/modules/roles/roles.enum';
import { StatusEnum } from 'src/modules/status/enum/statuses.enum';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { faker } from '@faker-js/faker';
import { Repository } from 'typeorm';

@Injectable()
export class UserSeedService {
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>,
  ) {}

  async run() {
    await this.repository.query('SET FOREIGN_KEY_CHECKS=0;');
    await this.repository.clear();
    await this.repository.query('SET FOREIGN_KEY_CHECKS=1;');
    
    const users: Partial<UserEntity>[] = [
      {
        firstName: 'Super',
        lastName: 'Admin',
        email: 'admin@example.com',
        password: bcrypt.hashSync('admin123', 10),
        role: {
          id: RoleEnum.ADMIN,
        } as any,
        status: {
          id: StatusEnum.ACTIVE,
        } as any,
      },
    ];

    for (let index = 1; index <= 100; index++) {
      users.push({
        email: faker.internet.email().toLowerCase(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        password: bcrypt.hashSync('user123', 10),
        role: {
          id: Math.floor(Math.random() * 4 + 2),
        } as any,
        status: {
          id: Math.floor(Math.random() * 4 + 1),
        } as any,
      });
    }

    //  await this.repository.clear();
    await this.repository.save(users);
  }
}
