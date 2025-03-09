import { AutoMap } from '@automapper/classes';
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
import { RatingReplyEntity } from './rating-reply.entity';

@Entity('rating')
export class RatingEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @AutoMap()
  id: string;

  @ManyToOne(() => GigEntity, (gig) => gig.ratings, { onDelete: 'CASCADE' })
  @AutoMap()
  gig: GigEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @AutoMap()
  user: UserEntity;

  @Column({ type: 'int' })
  @AutoMap()
  rateNumber: number;

  @Column({ type: 'text', nullable: true })
  @AutoMap()
  message: string;

  @OneToOne(() => RatingReplyEntity)
  @JoinColumn({ name: 'rating_reply' })
  @AutoMap()
  ratingReply: RatingReplyEntity;
}
