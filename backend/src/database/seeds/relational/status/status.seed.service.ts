import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusEntity } from 'src/modules/status/entities/status.entity';
import { StatusEnum } from 'src/modules/status/enum/statuses.enum';

import { Repository } from 'typeorm';

@Injectable()
export class StatusSeedService {
  constructor(
    @InjectRepository(StatusEntity)
    private repository: Repository<StatusEntity>,
  ) {}

  async run() {
    await this.repository.query('SET FOREIGN_KEY_CHECKS=0;');
    await this.repository.clear();
    await this.repository.query('SET FOREIGN_KEY_CHECKS=1;');

    const status: Partial<StatusEntity>[] = [
      {
        id: StatusEnum.ACTIVE,
        name: StatusEnum[StatusEnum.ACTIVE],
        description: `The user is using the platform normally.
        Pending Verification – The user needs to verify their email or identity (for sellers).`,
      },
      {
        id: StatusEnum.UNACTIVATED,
        name: StatusEnum[StatusEnum.UNACTIVATED],
        description: `The account was registered but has not been activated via email.`,
      },

      {
        id: StatusEnum.PENDING_VERIFICATION,
        name: StatusEnum[StatusEnum.PENDING_VERIFICATION],
        description: `The user needs to verify their email or identity (for sellers).`,
      },

      {
        id: StatusEnum.SUSPENDED,
        name: StatusEnum[StatusEnum.SUSPENDED],
        description: `The account violates the policy and is temporarily locked.`,
      },

      {
        id: StatusEnum.LOCKED,
        name: StatusEnum[StatusEnum.LOCKED],
        description: `The account is permanently locked due to serious violations.`,
      },
    ];

    await this.repository.save(status);

    console.log('Seeded statuses!');
  }
}
