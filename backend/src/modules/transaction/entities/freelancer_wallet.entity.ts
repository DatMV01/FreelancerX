import { FreelancerEntity } from 'src/modules/freelancer/entities/freelancer.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';


@Entity('freelancer_wallet')
export class FreelancerWalletEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'freelancer_id',
    nullable: false,
    type: 'char',
    length: 36,
  })
  freelancerId: string;

  @OneToOne(() => FreelancerEntity, { onDelete: 'CASCADE' })
  freelancer: FreelancerEntity;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  pendingEarrning: number;
  
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  pendingWidthdraw: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  availableBalance: number;

  @Column({ type: 'varchar', length: 10, default: 'USD' })
  currency: string;

  @CreateDateColumn()
  createdAt: Date;
}
