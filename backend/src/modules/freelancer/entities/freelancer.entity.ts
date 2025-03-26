import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AutoMap } from '@automapper/classes';
import { BaseEntity } from 'src/modules/base/entities/base.entity';
import { GigEntity } from 'src/modules/gig/entities/gig.entity';
import { OrderEntity } from 'src/modules/order/entities/order.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { FreelancerRankEnum } from '../enum/freelancerRank.enum';

@Entity('freelancer')
export class FreelancerEntity extends BaseEntity {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @AutoMap()
  email: string;

  @AutoMap(() => UserEntity)
  @OneToOne(() => UserEntity, (user) => user.freelancerProfile, {
    nullable: false,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'email', referencedColumnName: 'email' })
  userProfile: UserEntity;

  @AutoMap()
  @Column({
    type: 'enum',
    enum: FreelancerRankEnum,
    default: FreelancerRankEnum.NEW,
  })
  level: FreelancerRankEnum;

  @AutoMap()
  @Column({ type: 'text', nullable: true })
  about?: string;

  @AutoMap(() => [String])
  @Column({ type: 'simple-array', nullable: true })
  skills?: string[];

  @AutoMap(() => [String])
  @Column({ type: 'simple-array', nullable: true })
  languages?: string[];

  @AutoMap()
  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0.0 })
  rating: number;

  @AutoMap()
  @Column({ type: 'int', default: 0 })
  reviewCount: number;

  @AutoMap()
  @Column({ type: 'int', default: 0 })
  completedOrderCount: number;

  @AutoMap()
  @Column({ type: 'int', nullable: true })
  responseTime?: number;

  @AutoMap()
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  earnings: number;

  @AutoMap()
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  withdrawnAmount: number;

  @AutoMap(() => [GigEntity])
  @OneToMany(() => GigEntity, (gig) => gig.freelancer, {
    eager: false,
    onDelete: 'NO ACTION',
  })
  gigs: GigEntity[];

  @AutoMap(() => [OrderEntity])
  @OneToMany(() => OrderEntity, (order) => order.freelancer, {
    eager: false,
    onDelete: 'NO ACTION',
  })
  orders: OrderEntity[];
}
