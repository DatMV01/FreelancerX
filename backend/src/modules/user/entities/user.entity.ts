import { AutoMap } from '@automapper/classes';
import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/modules/base/entities/base.entity';
import { FileEntity } from 'src/modules/files/entities/file.entity';
import { FreelancerEntity } from 'src/modules/freelancer/entities/freelancer.entity';
import { NotificationEntity } from 'src/modules/notification/entities/notification.entity';
import { OrderEntity } from 'src/modules/order/entities/order.entity';
import { ReviewEntity } from 'src/modules/review/entities/review.entity';
import { RoleEntity } from 'src/modules/role/entities/role.entity';
import { StatusEntity } from 'src/modules/status/entities/status.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AuthProvidersEnum } from '../enum/user.provider';
import { RatingEntity } from 'src/modules/rating/entities/rating.entity';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap()
  @Column({ type: 'varchar', unique: true })
  email: string;

  @AutoMap()
  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @AutoMap()
  @Column({
    type: 'enum',
    enum: AuthProvidersEnum,
    default: AuthProvidersEnum.EMAIL,
  })
  provider: AuthProvidersEnum;

  @AutoMap()
  @Column()
  fullName: string;

  @AutoMap()
  @Column({ nullable: true })
  country?: string;

  @AutoMap()
  @Column({ nullable: true })
  avatar?: string;

  @AutoMap()
  @Column({ nullable: true })
  phoneNumber?: string;

  /* ROLE */
  @AutoMap()
  @Column({ name: 'role_id', nullable: true })
  roleId?: number;

  @AutoMap(() => RoleEntity)
  @ManyToOne(() => RoleEntity, (role) => role.users, {
    onDelete: 'SET NULL',
    eager: true,
  })
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;

  /* STATUS */
  @AutoMap()
  @Column({ name: 'status_id', nullable: true })
  statusId?: number;

  @AutoMap(() => StatusEntity)
  @ManyToOne(() => StatusEntity, (status) => status.users, {
    onDelete: 'SET NULL',
    eager: true,
  })
  @JoinColumn({ name: 'status_id' })
  status: StatusEntity;

  /* FREELANCER */
  @AutoMap(() => FreelancerEntity)
  @OneToOne(() => FreelancerEntity, (freelancer) => freelancer.user, {
    cascade: true,
    eager: true,
  })
  freelancer: FreelancerEntity;

  /* ORDERS */
  @AutoMap(() => [OrderEntity])
  @OneToMany(() => OrderEntity, (order) => order.buyer)
  buyerorders: OrderEntity[];

  /* REVIEWS */
  // @AutoMap(() => [ReviewEntity])
  // @OneToMany(() => ReviewEntity, (review) => review.buyer)
  // reviews: ReviewEntity[];

  @AutoMap(() => [RatingEntity])
  @OneToMany(() => RatingEntity, (ratings) => ratings.user)
  ratings: RatingEntity[];

  /* NOTIFICATIONS */
  @AutoMap(() => [NotificationEntity])
  @OneToMany(() => NotificationEntity, (notification) => notification.user)
  notifications: NotificationEntity[];

  /* FILES */
  @AutoMap(() => [FileEntity])
  @OneToMany(() => FileEntity, (files) => files.user)
  files: FileEntity[];
}
