import { AutoMap } from '@automapper/classes';
import { BaseEntity } from 'src/modules/base/entities/base.entity';
import { GigEntity } from 'src/modules/gig/entities/gig.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';

@Entity('reviews')
export class ReviewEntity extends BaseEntity {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap()
  @ManyToOne(() => UserEntity, (user) => user.reviews)
  @JoinColumn({ name: 'buyer_id' })
  buyer: UserEntity;

  @AutoMap()
  @ManyToOne(() => GigEntity, (gig) => gig.reviews)
  @JoinColumn({ name: 'gig_id' })
  gig: GigEntity;

  @AutoMap()
  @Column()
  rating: number; // 1 to 5
}
