import { Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { BaseController } from 'src/modules/base/base.controller';
import { UserDto } from 'src/modules/user/dto/user.dto';
import { Not } from 'typeorm';
import { CreateSessionDto } from './dto/create-session.dto';
import { SessionDto } from './dto/session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { SessionEntity } from './entities/session.entity';
import { SessionService } from './session.service';

import { SerializeOptions, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import {
  CREATE_GROUP,
  UPDATE_GROUP,
} from 'src/common/constant/serialize.group';

@Controller({
  path: 'session',
  version: '1',
})
export class SessionController extends BaseController<
  SessionEntity,
  SessionDto,
  CreateSessionDto,
  UpdateSessionDto
> {
  constructor(private readonly sessionService: SessionService) {
    super(
      sessionService,
      SessionEntity,
      SessionDto,
      CreateSessionDto,
      UpdateSessionDto,
    );
  }

  @Post()
  // @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({ groups: [CREATE_GROUP] })
  @ApiOperation({ summary: 'Create a new entity' })
  @ApiBody({ type: CreateSessionDto, required: false })
  @ApiResponse({
    status: 201,
    description: 'Entity created successfully',
    type: SessionDto,
  })
  async create(data: CreateSessionDto): Promise<SessionDto> {
    return super.create(data);
  }

  @Patch(':id')
  // @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({ groups: [UPDATE_GROUP] })
  @ApiOperation({ summary: 'Update an entity' })
  @ApiParam({ name: 'id', type: String, required: false })
  @ApiBody({ type: UpdateSessionDto, required: false })
  @ApiResponse({
    status: 200,
    description: 'Entity updated successfully',
    type: SessionDto,
  })
  async update(id: string, data: UpdateSessionDto): Promise<SessionDto> {
    return super.update(id, data);
  }

  @Delete('/user/:userId')
  // @UseGuards(AuthGuard('jwt'))
  @ApiParam({ name: 'userId', type: String, required: true })
  @ApiOperation({ summary: 'Delete an all session' })
  @ApiResponse({ status: 200, description: 'All session deleted successfully' })
  async removeAllSession(
    @Param('userId') userId: UserDto['id'],
  ): Promise<boolean> {
    return this.sessionService.remove({
      user: {
        id: userId.toString(),
      },
    });
  }

  @Delete('/:userId/:sessionId')
  // @UseGuards(AuthGuard('jwt'))
  @ApiParam({ name: 'userId', type: String, required: true })
  @ApiParam({ name: 'sessionId', type: String, required: true })
  @ApiOperation({ summary: 'Delete all sessions except the current one.' })
  @ApiResponse({
    status: 200,
    description: 'All session except the current one deleted successfully',
  })
  async deleteByUserIdWithExclude(
    @Param('userId') userId: UserDto['id'],
    @Param('sessionId') excludeSessionId: SessionDto['id'],
  ): Promise<boolean> {
    return this.sessionService.remove({
      user: {
        id: userId.toString(),
      },
      id: Not(String(excludeSessionId)),
    });
  }
}
