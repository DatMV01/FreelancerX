import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { FreelancerEntity } from './freelancer.entity';

@Entity('freelancer_analytics')
export class FreelancerAnalyticsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => FreelancerEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'freelancer_id' })
  freelancer: FreelancerEntity;

  @Column({ name: 'total_orders', type: 'int', default: 0 })
  totalOrders: number;

  @Column({ name: 'completed_orders', type: 'int', default: 0 })
  completedOrders: number;

  @Column({ name: 'cancelled_orders', type: 'int', default: 0 })
  cancelledOrders: number;

  @Column({ name: 'total_earnings', type: 'float', default: 0 })
  totalEarnings: number;

  @Column({ name: 'average_rating', type: 'float', default: 0 })
  averageRating: number;

  @Column({ name: 'review_count', type: 'int', default: 0 })
  reviewCount: number;

  @Column({ name: 'response_time', type: 'int', nullable: true }) // tính bằng phút
  responseTime: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
