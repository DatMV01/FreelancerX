import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from 'src/modules/role/entities/role.entity';
import { RoleEnum } from 'src/modules/role/enum/role.enum';

import { Repository } from 'typeorm';

@Injectable()
export class RoleSeedService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly repository: Repository<RoleEntity>,
  ) {}

  async run() {
    await this.repository.query('SET FOREIGN_KEY_CHECKS=0;');
    await this.repository.clear();
    await this.repository.query('SET FOREIGN_KEY_CHECKS=1;');

    const roles: Partial<RoleEntity>[] = [
      {
        id: RoleEnum.ADMIN,
        name: RoleEnum[RoleEnum.ADMIN],
        description:
          'The person who manages the entire system, moderates and manages users, and monitors activities on the website.',
      },
      {
        id: RoleEnum.SELLER,
        name: RoleEnum[RoleEnum.SELLER],
        description:
          'A person who provides services, can post gigs, receive orders, and fulfill requests from customers.',
      },
      {
        id: RoleEnum.BUYER,
        name: RoleEnum[RoleEnum.BUYER],
        description:
          'A person who buys services from freelancers, can view gigs, place orders, and make payments.',
      },
      {
        id: RoleEnum.GUEST,
        name: RoleEnum[RoleEnum.GUEST],
        description:
          'A user who has not registered or logged into the system and can only search for services and view gigs.',
      },
      // {
      //   id: RoleEnum.REGISTERED,
      //   name: RoleEnum[RoleEnum.REGISTERED],
      //   description:
      //     'A user who has created an account and can perform actions such as searching for gigs, registering for gigs, submitting requests, or purchasing services.',
      // },
    ];

    await this.repository.save(roles);

    console.log('Seeded roles!');
  }
}
