import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from 'src/modules/base/dto/base.dto';

export class RatingDto extends BaseDto<RatingDto> {
  @AutoMap()
  @ApiProperty()
  gigId: string;

  @AutoMap()
  @ApiProperty()
  userId: string;

  @AutoMap()
  @ApiProperty()
  freelancerId: string;

  @AutoMap()
  @ApiProperty()
  rateNumber: number;

  @AutoMap()
  @ApiProperty()
  comment: string;

  @AutoMap()
  @ApiProperty()
  reply?: string | null;

  @AutoMap(() => Date)
  @ApiProperty()
  replyAt: Date;
}
