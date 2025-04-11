import { AutoMap } from '@automapper/classes';
import { BaseEntity } from 'src/modules/base/entities/base.entity';
import { FreelancerEntity } from 'src/modules/freelancer/entities/freelancer.entity';
import { GigEntity } from 'src/modules/gig/entities/gig.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('gig_reviews')
export class ReviewEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @AutoMap()
  id: string;

  /* GIG */
  @AutoMap()
  @Index()
  @Column({ type: 'char', length: 36, name: 'gig_id', nullable: true })
  gigId: string;

  @AutoMap()
  @ManyToOne(() => GigEntity, (gig) => gig.ratings, {
    eager: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'gig_id' })
  gig: GigEntity;

  /* USER */
  @AutoMap()
  @Column({ type: 'char', length: 36, name: 'user_id', nullable: true })
  userId?: string | null;

  @AutoMap()
  @ManyToOne(() => UserEntity, (user) => user.ratings, {
    eager: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  /* FREELANCER */
  @AutoMap()
  @Column({ type: 'char', length: 36, name: 'freelancer_id', nullable: true })
  freelancerId?: string | null;

  @AutoMap()
  @ManyToOne(() => FreelancerEntity, (freelancer) => freelancer.ratings, {
    eager: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'freelancer_id' })
  freelancer: FreelancerEntity;

  /* RATE NUMBER */
  @Column({
    type: 'decimal',
    precision: 3,
    scale: 2,
    default: 0,
    nullable: false,
  })
  @AutoMap()
  rateNumber: number;

  /* COMMENT */
  @Column({ type: 'text', nullable: true })
  @AutoMap()
  comment?: string | null;

  /* REPLY */
  @AutoMap()
  @Column({ type: 'text', nullable: true })
  reply?: string | null;

  @AutoMap(() => Date)
  @Column({ type: 'datetime', precision: 6, nullable: true, default: null })
  replyAt?: Date | null;
}
