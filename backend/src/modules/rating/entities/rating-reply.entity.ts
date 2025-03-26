import { AutoMap } from '@automapper/classes';
import { BaseEntity } from 'src/modules/base/entities/base.entity';
import { FreelancerEntity } from 'src/modules/freelancer/entities/freelancer.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RatingEntity } from './rating.entity';

@Entity('rating_reply')
export class RatingReplyEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @AutoMap()
  id: string;

  @AutoMap()
  @OneToOne(() => RatingEntity)
  rating: RatingEntity;

  @AutoMap()
  @Column({ name: 'freelancer_id', nullable: true })
  freelancerId: string;

  @AutoMap()
  @ManyToOne(() => FreelancerEntity, (freelancer) => freelancer.ratingReplies)
  @JoinColumn({ name: 'freelancer_id' })
  freelancer: FreelancerEntity;

  @Column({ type: 'text' })
  @AutoMap()
  message: string;
}
