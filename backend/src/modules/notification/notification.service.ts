import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../base/base.service';
import { NotificationEntity } from './entities/notification.entity';

@Injectable()
export class NotificationService extends BaseService<NotificationEntity> {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly _repository: Repository<NotificationEntity>,
  ) {
    super(_repository);
  }
}
