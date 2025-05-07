import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RawQueryDto {
  @ApiProperty({
    description:
      'Raw query string, e.g. page=1&pageSize=10&filters=status:active',
    example:
      'page=1&pageSize=10&sorts=createdAt%3ADESC%2CupdatedAt%3ADESC&filters=status%3Ain_ACTIVE',
    //example: 'page=1&pageSize=10&sorts=updatedAt%3ADESC%2CcreatedAt%3ADESC&filters=status%3Ain_ACTIVE',
  })
  @IsOptional()
  raw: string;
}
