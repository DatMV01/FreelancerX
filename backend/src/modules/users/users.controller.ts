import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';

import { ADMIN_GROUP } from 'src/common/constant/serialize.group';
import { NullableType } from 'src/utils/types/nullable.type';
import { PageDto, PageMetaDto } from '../base/dto/pagination';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createProfileDto: CreateUserDto): Promise<UserDto> {
    return this.usersService.create(createProfileDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  // http://localhost:3000/api/v1/users?page=1&limit=10&sort=role.id,asc;createdAt,desc
  // http://localhost:3000/api/v1/users?page=1&limit=10&sort=email,asc;createdAt,desc
  async findAll(@Query() query: QueryUserDto): Promise<PageDto<UserDto>> {
    query.limit = Math.min(query.limit || 10, 50);

    const [users, count] =
      await this.usersService.findManyWithPagination(query);

    const pageDto = new PageDto<UserDto>(
      users,
      new PageMetaDto({
        itemCount: count,
        pageOptionsDto: {
          limit: query.limit,
          page: query.page,
          sorts: query.sort,
        },
      }),
    );

    return pageDto;
  }

  @Get('private')

  // http://localhost:3000/api/v1/users?page=1&limit=10&sort=role.id,asc;createdAt,desc
  // http://localhost:3000/api/v1/users?page=1&limit=10&sort=email,asc;createdAt,desc
  async findAll2(@Query() query: QueryUserDto): Promise<PageDto<UserDto>> {
    query.limit = Math.min(query.limit || 10, 50);

    const [users, count] =
      await this.usersService.findManyWithPagination(query);

    const pageDto = new PageDto<UserDto>(
      users,
      new PageMetaDto({
        itemCount: count,
        pageOptionsDto: {
          limit: query.limit,
          page: query.page,
          sorts: query.sort,
        },
      }),
    );

    return pageDto;
  }

  @Get(':id')
  @SerializeOptions({ groups: [ADMIN_GROUP] })
  findOne(@Param('id') id: UserDto['id']): Promise<NullableType<UserDto>> {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  @SerializeOptions({ groups: [ADMIN_GROUP] })
  update(
    @Param('id') id: UserDto['id'],
    @Body() updateProfileDto: UpdateUserDto,
  ): any {
    return this.usersService.update(id, updateProfileDto);
  }
}
