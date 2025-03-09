import { BaseEntity } from 'src/modules/base/entities/base.entity';
import { GigEntity } from 'src/modules/gig/entities/gig.entity';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RatingReplyEntity } from './rating-owner-reply.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('rating')
export class RatingEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @ManyToOne(() => GigEntity, (gig) => gig.ratings, { onDelete: 'CASCADE' })
  @ApiProperty()
  gig: GigEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @ApiProperty()
  user: UserEntity;

  @Column({ type: 'int' })
  @ApiProperty()
  rating: number;

  @Column({ type: 'text', nullable: true })
  @ApiProperty()
  review: string;
  
  @ApiProperty()
  @OneToOne(() => RatingReplyEntity)
  @JoinColumn({ name: 'rating_reply' })
  ratingReply: RatingReplyEntity;
}
