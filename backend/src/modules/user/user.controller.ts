import { Controller } from '@nestjs/common';
import { BaseController } from '../base/base.controller';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';

@Controller({
  path: 'user',
  version: '1',
})
export class UserController extends BaseController<
  UserEntity,
  UserDto,
  CreateUserDto,
  UpdateUserDto
> {
  constructor(protected readonly service: UserService) {
    super(service, UserDto, UserEntity);
  }
}
