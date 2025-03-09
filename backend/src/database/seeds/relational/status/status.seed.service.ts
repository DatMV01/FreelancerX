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
        id: StatusEnum.BANNED,
        name: StatusEnum[StatusEnum.BANNED],
        description: `The account is permanently locked due to serious violations.`,
      },

      {
        id: StatusEnum.DEACTIVATED,
        name: StatusEnum[StatusEnum.DEACTIVATED],
        description: `The user has deleted the account themselves or the system has locked it.`,
      },
    ];

    await this.repository.save(status);

    console.log('Seeded statuses!');
  }
}
