import { BaseEntity } from 'src/modules/base/entities/base.entity';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { RatingEntity } from './rating.entity';

@Entity('rating_replies')
export class RatingReplyEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => RatingEntity)
  rating: RatingEntity;

  @ManyToOne(() => UserEntity)
  owner: UserEntity;

  @Column({ type: 'text' })
  reply: string;
}
