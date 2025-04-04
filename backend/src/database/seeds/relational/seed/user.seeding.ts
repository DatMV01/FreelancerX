import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';
import { RoleEnum } from 'src/modules/role/enum/role.enum';
import { StatusEnum } from 'src/modules/status/enum/statuses.enum';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserSeeding {
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
        fullName: 'Super Admin',
        email: 'admin@example.com',
        password: bcrypt.hashSync('user123', 10),
        avatar: faker.image.avatar(),
        country: 'Vietnam',
        phone: faker.phone.number(),
        roleId: RoleEnum.ADMIN,
        statusId: StatusEnum.ACTIVE,
        // role: {
        //   id: RoleEnum.ADMIN,
        // } as any,
        // status: {
        //   id: StatusEnum.ACTIVE,
        // } as any,
      },
    ];

    for (let index = 1; index <= 50; index++) {
      users.push({
        email: `user${index}@example.com`,
        fullName: `${faker.person.lastName()} ${faker.person.firstName()}`,
        password: bcrypt.hashSync('user123', 10),
        avatar: faker.image.avatar(),
        country: faker.location.country(),
        phone: faker.phone.number(),
        roleId: Math.floor(Math.random() * 4 + 1),
        statusId: Math.floor(Math.random() * 5 + 1),
        // role: {
        //   id: Math.floor(Math.random() * 4 + 1),
        // } as any,
        // status: {
        //   id: Math.floor(Math.random() * 5 + 1),
        // } as any,
      });
    }

    await this.repository.save(users);

    console.log('\n == Users are seeded completely !!! == \n');
  }
}
