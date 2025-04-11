import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { OrderEntity } from './order.entity';

export enum RevisionStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

@Entity('order_revisions')
export class RevisionRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => OrderEntity)
  order: OrderEntity;

  @Column()
  message: string;

  @Column({
    type: 'enum',
    enum: RevisionStatus,
    default: RevisionStatus.PENDING,
  })
  status: RevisionStatus;

  @CreateDateColumn()
  createdAt: Date;
}
