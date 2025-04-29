import { AutoMap } from '@automapper/classes';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { BaseDto } from 'src/modules/base/dto/base.dto';
import { FileEntity } from 'src/modules/files/entities/file.entity';
import { FreelancerDto } from 'src/modules/freelancer/dto/freelancer.dto';
import { NotificationDto } from 'src/modules/notification/dto/notification.dto';
import { OrderDto } from 'src/modules/order/dto/order.dto';
import { RoleDto } from 'src/modules/role/dto/role.dto';
import { StatusDto } from 'src/modules/status/dto/status.dto';
import { TransactionDto } from 'src/modules/wallet/dto/transaction.dto';
import { undefinedTransformer } from 'src/utils/transformers/index.transformer';
import { AuthProvidersEnum } from '../enum/user.provider';
import { GigReviewDto } from 'src/modules/gigreview/dto/gigreview.dto';

export class UserDto extends BaseDto<UserDto> {
  @AutoMap()
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @AutoMap()
  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @AutoMap()
  @Exclude()
  password: string;

  @AutoMap(() => String)
  @ApiPropertyOptional({
    enum: AuthProvidersEnum,
    example: AuthProvidersEnum.EMAIL,
    enumName: 'AuthProvidersEnum',
  })
  provider: AuthProvidersEnum;

  @AutoMap()
  @ApiProperty({ example: 'Nguyen Van A' })
  fullName: string;

  @AutoMap()
  @ApiPropertyOptional({ example: 'Vietnam', nullable: true })
  // @Transform((params) => undefinedTransformer(params))
  country?: string;

  @AutoMap()
  @ApiPropertyOptional({
    example: 'https://example.com/avatar.jpg',
    nullable: true,
  })
  // // @Transform((params) => undefinedTransformer(params))
  avatar?: string = undefined;

  @AutoMap()
  @ApiPropertyOptional({ example: '+84901234567', nullable: true })
  // @Transform((params) => undefinedTransformer(params))
  phone?: string;

  @AutoMap(() => RoleDto)
  @Transform((params) => undefinedTransformer(params, ['id', 'name']))
  @ApiProperty({ type: RoleDto })
  role: RoleDto;

  @AutoMap(() => StatusDto)
  @Transform((params) => undefinedTransformer(params, ['id', 'name']))
  @ApiProperty({ type: StatusDto })
  status: StatusDto;

  @AutoMap(() => FreelancerDto)
  @Expose({ name: 'freelancer' })
  // @Transform((params) => undefinedTransformer(params))
  @ApiPropertyOptional({ type: FreelancerDto, nullable: true })
  freelancer?: FreelancerDto;

  /* ORDERS */
  @AutoMap(() => [OrderDto])
  // @Transform((params) => undefinedTransformer(params))
  @ApiPropertyOptional({ type: [OrderDto], example: [], nullable: true })
  buyerorders?: OrderDto[];

  /* RATINGS */
  @AutoMap(() => [GigReviewDto])
  // @Transform((params) => undefinedTransformer(params))
  @ApiPropertyOptional({ type: [GigReviewDto], example: [], nullable: true })
  reviews?: GigReviewDto[];

  /* NOTIFICATIONS */
  @AutoMap(() => [NotificationDto])
  // @Transform((params) => undefinedTransformer(params))
  @ApiPropertyOptional({ type: [NotificationDto], example: [], nullable: true })
  notifications?: NotificationDto[];

  /* FILES */
  @AutoMap(() => [FileEntity])
  // @Transform((params) => undefinedTransformer(params))
  @ApiPropertyOptional({ type: [FileEntity], example: [], nullable: true })
  files?: FileEntity[];

  /* TRANSACTIONS */
  @AutoMap(() => [TransactionDto])
  // @Transform((params) => undefinedTransformer(params))
  @ApiPropertyOptional({ type: [TransactionDto], example: [], nullable: true })
  transactions?: TransactionDto[];
}
