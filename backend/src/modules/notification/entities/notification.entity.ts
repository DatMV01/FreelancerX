import { AutoMap } from '@automapper/classes';
import { BaseEntity } from 'src/modules/base/entities/base.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { NotificationType } from '../enum/notification.enum';

@Entity('notifications')
export class NotificationEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @AutoMap()
  id: string;

  /* USER */
  @AutoMap()
  @Column({ type: 'char', length: 36, name: 'user_id', nullable: true })
  userId: string;

  @ManyToOne(() => UserEntity, (user) => user.notifications, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'user_id' })
  @AutoMap()
  user: UserEntity;

  @AutoMap()
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @AutoMap()
  @Column({ type: 'text' })
  message: string;

  @AutoMap()
  @Column({ type: 'boolean', default: false })
  isRead: boolean;

  @Column({
    type: 'enum',
    enum: NotificationType,
    default: NotificationType.MESSAGE,
  })
  @AutoMap()
  type: NotificationType;

  @Column({ type: 'boolean', default: false })
  @AutoMap()
  isPushSent: boolean;

  markAsRead() {
    this.isRead = true;
  }
  
  markPushSent() {
    this.isPushSent = true;
  }
}
