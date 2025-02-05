import { Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { BaseController } from 'src/modules/base/base.controller';
import { UserDto } from 'src/modules/users/dto/user.dto';
import { Not } from 'typeorm';
import { CreateSessionDto } from '../dto/create-session.dto';
import { SessionDto } from '../dto/session.dto';
import { UpdateSessionDto } from '../dto/update-session.dto';
import { SessionEntity } from '../entities/session.entity';
import { SessionService } from '../service/session.service';

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
    super(sessionService, SessionDto, SessionEntity);
  }

  @Post()
  create(data: CreateSessionDto): Promise<SessionDto> {
    return super.create(data);
  }

  @Patch(':id')
  update(id: string, data: UpdateSessionDto): Promise<SessionDto | null> {
    return super.update(id, data);
  }

  @Delete('/user/:userID')
  async deleteByUserId(
    @Param('userID') userId: UserDto['id'],
  ): Promise<boolean> {
    return this.sessionService.removeByCondition({
      user: {
        id: userId.toString(),
      },
    });
  }

  @Delete('/:userID/:sessionID')
  async deleteByUserIdWithExclude(
    @Param('userID') userId: UserDto['id'],
    @Param('sessionID') excludeSessionId: SessionDto['id'],
  ): Promise<boolean> {
    return this.sessionService.removeByCondition({
      user: {
        id: userId.toString(),
      },
      id: Not(Number(excludeSessionId)),
    });
  }
}
