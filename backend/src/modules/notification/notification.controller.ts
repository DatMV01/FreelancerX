import { Controller } from '@nestjs/common';
import { BaseController } from '../base/base.controller';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationDto } from './dto/notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationEntity } from './entities/notification.entity';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController extends BaseController<
  NotificationEntity,
  NotificationDto,
  CreateNotificationDto,
  UpdateNotificationDto
> {
  constructor(protected readonly _service: NotificationService) {
    super(_service, NotificationDto, NotificationEntity);
  }
}
