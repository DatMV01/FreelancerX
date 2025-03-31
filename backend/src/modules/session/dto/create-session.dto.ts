import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSessionDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The unique identifier of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  user: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Hashed session token for authentication',
    example: 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3',
  })
  hash: string;
}
