import {
  Controller,
  Patch,
  Post,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { BaseController } from '../base/base.controller';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationDto } from './dto/notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationEntity } from './entities/notification.entity';
import { NotificationService } from './notification.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CREATE_GROUP, UPDATE_GROUP } from 'src/common/constant/serialize.group';

@Controller('notification')
export class NotificationController extends BaseController<
  NotificationEntity,
  NotificationDto,
  CreateNotificationDto,
  UpdateNotificationDto
> {
  constructor(protected readonly _service: NotificationService) {
    super(
      _service,
      NotificationEntity,
      NotificationDto,
      CreateNotificationDto,
      UpdateNotificationDto,
    );
  }

  @Post()
  // @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({ groups: [CREATE_GROUP] })
  @ApiOperation({ summary: 'Create a new entity' })
  @ApiBody({ type: CreateNotificationDto, required: false })
  @ApiResponse({
    status: 201,
    description: 'Entity created successfully',
    type: NotificationDto,
  })
  async create(data: CreateNotificationDto): Promise<NotificationDto> {
    return super.create(data);
  }

  @Patch(':id')
  // @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({ groups: [UPDATE_GROUP] })
  @ApiOperation({ summary: 'Update an entity' })
  @ApiParam({ name: 'id', type: String, required: false })
  @ApiBody({ type: UpdateNotificationDto, required: false })
  @ApiResponse({
    status: 200,
    description: 'Entity updated successfully',
    type: NotificationDto,
  })
  async update(
    id: string,
    data: UpdateNotificationDto,
  ): Promise<NotificationDto> {
    return super.update(id, data);
  }
}
