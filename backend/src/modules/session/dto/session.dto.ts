import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from 'src/modules/base/dto/base.dto';
import { UserDto } from 'src/modules/user/dto/user.dto';
import { UserEntity } from 'src/modules/user/entities/user.entity';

export class SessionDto extends BaseDto<SessionDto> {
  @Transform(({ value }) => {
    if (value instanceof UserEntity) {
      const { id, email } = value;
      return { id, email };
    }
    return value;
  })
  @ApiProperty({
    description: 'User information associated with the session',
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'user@example.com',
    },
  })
  user: UserDto;

  @ApiProperty({
    description: 'Hashed session token for authentication',
    example: 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3',
  })
  hash: string;
}
