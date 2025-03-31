import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SessionEntity } from './entities/session.entity';
import { Not, Repository } from 'typeorm';
import { BaseService } from 'src/modules/base/base.service';
import { SessionDto } from './dto/session.dto';

@Injectable()
export class SessionService extends BaseService<SessionEntity> {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionRepository: Repository<SessionEntity>,
  ) {
    super(sessionRepository);
  }

  async deleteByUserId(userId: string): Promise<boolean> {
    return super.remove({
      user: {
        id: userId.toString(),
      },
    });
  }

  async deleteByUserIdWithExclude(conditions: {
    userId: string;
    excludeSessionId: SessionDto['id'];
  }): Promise<boolean> {
    return super.remove({
      user: {
        id: conditions.userId.toString(),
      },
      id: Not(String(conditions.excludeSessionId)),
    });
  }
}
