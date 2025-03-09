import { BaseEntity } from 'src/modules/base/entities/base.entity';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RatingEntity } from './rating.entity';
import { AutoMap } from '@automapper/classes';

@Entity('rating_replies')
export class RatingReplyEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @AutoMap()
  id: string;

  @OneToOne(() => RatingEntity)
  @AutoMap()
  rating: RatingEntity;

  @ManyToOne(() => UserEntity)
  @AutoMap()
  owner: UserEntity;

  @Column({ type: 'text' })
  @AutoMap()
  message: string;
}
