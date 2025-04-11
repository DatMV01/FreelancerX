import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';
import { RoleEnum } from 'src/modules/role/enum/role.enum';
import { StatusEnum } from 'src/modules/status/enum/statuses.enum';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { FreelancerEntity } from 'src/modules/freelancer/entities/freelancer.entity';

@Injectable()
export class UserSeeding {
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>,

    @InjectRepository(FreelancerEntity)
    private freelancerRepository: Repository<FreelancerEntity>,
  ) {}

  async run() {
    await this.repository.query('SET FOREIGN_KEY_CHECKS=0;');
    await this.repository.clear();
    await this.repository.query('SET FOREIGN_KEY_CHECKS=1;');

    const reelancerAdmin = this.freelancerRepository.create({
      id: '91bfe180-9448-4b32-84ae-a6b8a6d99b84',
      userId: 'cf946efc-e04b-49b1-a547-268c69d3ceef',
      email: 'mamotgio@gmail.com',
      fullName: 'Mai Dat',
      phone: '0818012377',
      country: 'Ecuador',
      bio: 'Expert mobile app developer',
      skills: [
        {
          id: 4,
          name: 'Backend Development',
          proficiency: 'Beginner',
        },
        {
          id: 15,
          name: 'Chatbot Development',
          proficiency: 'Advanced',
        },
        {
          id: 10,
          name: 'SaaS Development',
          proficiency: 'Beginner',
        },
      ],
      languages: [
        {
          id: 3,
          name: 'Avestan',
          proficiency: 'Beginner',
        },
        {
          id: 3,
          name: 'Bambara',
          proficiency: 'Advanced',
        },
      ],
    } as any);

    const users: Partial<UserEntity>[] = [
      {
        id: 'cf946efc-e04b-49b1-a547-268c69d3ceef',
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

    await this.freelancerRepository.save(reelancerAdmin);

    console.log('\n == Users are seeded completely !!! == \n');
  }
}
