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

@Entity('notifications')
export class NotificationEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @AutoMap()
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.notifications)
  @JoinColumn({ name: 'user_id' })
  @AutoMap()
  user: UserEntity;

  @Column()
  @AutoMap()
  title: string;

  @Column()
  @AutoMap()
  message: string;

  @Column({ default: false })
  @AutoMap()
  isRead: boolean;
}
