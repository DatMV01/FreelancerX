import { AutoMap } from '@automapper/classes';
import { BaseEntity } from 'src/modules/base/entities/base.entity';
import { FreelancerEntity } from 'src/modules/freelancer/entities/freelancer.entity';
import { GigEntity } from 'src/modules/gig/entities/gig.entity';
import { OrderEntity } from 'src/modules/order/entities/order.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('gig_reviews')
export class GigReviewEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @AutoMap()
  id: string;

  /* GIG */
  @AutoMap()
  @Column({ type: 'char', length: 36, name: 'gig_id', nullable: true })
  gigId: string;

  @AutoMap(() => GigEntity)
  @ManyToOne(() => GigEntity, (gig) => gig.reviews, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'gig_id' })
  gig: GigEntity;

  /* REVIEWER */
  @AutoMap()
  @Column({ type: 'char', length: 36, name: 'reviewer_id', nullable: true })
  reviewerId: string;

  @AutoMap()
  @ManyToOne(() => UserEntity, (user) => user.reviews, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'reviewer_id' })
  reviewer: UserEntity;

  /* ORDER */
  @AutoMap()
  @Column({ type: 'char', length: 36, name: 'order_id', nullable: true })
  orderId: string;

  @ManyToOne(() => OrderEntity, (order) => order.reviews, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity;

  /* RATE NUMBER */
  @Column({
    type: 'decimal',
    precision: 3,
    scale: 2,
    default: 0,
    nullable: false,
  })
  @AutoMap()
  rating: number;

  /* COMMENT */
  @Column({ type: 'text', nullable: true })
  @AutoMap()
  comment: string;

  /* FREELANCER */
  @AutoMap()
  @Column({ type: 'char', length: 36, name: 'freelancer_id', nullable: true })
  freelancerId: string;

  @AutoMap()
  @ManyToOne(() => FreelancerEntity, (freelancer) => freelancer.ratings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'freelancer_id' })
  freelancer: FreelancerEntity;

  /* REPLY */
  @AutoMap()
  @Column({ type: 'text', nullable: true })
  reply: string;

  @AutoMap(() => Date)
  @Column({ type: 'datetime', precision: 6, nullable: true, default: null })
  repliedAt: Date;
}
