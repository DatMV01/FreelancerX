import { AutoMap } from '@automapper/classes';
import { Exclude, Expose } from 'class-transformer';
import { ADMIN_GROUP, ME_GROUP } from 'src/common/constant/serialize.group';
import { BaseEntity } from 'src/modules/base/entities/base.entity';
import { NotificationEntity } from 'src/modules/notification/entities/notification.entity';
import { OrderEntity } from 'src/modules/order/entities/order.entity';
import { ReviewEntity } from 'src/modules/review/entities/review.entity';
import { RoleEntity } from 'src/modules/roles/entities/role.entity';
import { SellerEntity } from 'src/modules/seller/entities/seller.entity';
import { StatusEntity } from 'src/modules/status/entities/status.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'user',
})
export class UserEntity extends BaseEntity {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap()
  @Column({ type: 'varchar', unique: true, nullable: true })
  email: string;

  @Column({ type: 'varchar', unique: true, nullable: true })
  username?: string;

  @AutoMap()
  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  password?: string;

  @AutoMap()
  @Column({ default: 'email' })
  provider: string;

  // @AutoMap()
  // @Column({ type: String, nullable: true })
  // socialId?: string | null;

  @AutoMap()
  @Column({ nullable: false })
  country: string;

  @AutoMap()
  @Column({ nullable: false })
  fullName: string;

  @AutoMap()
  @Column({ type: String, nullable: true })
  avatar?: string | null;

  @AutoMap()
  @Column({ nullable: true })
  phoneNumber?: string;

  @AutoMap(() => RoleEntity)
  @ManyToOne(() => RoleEntity, (role) => role.users, {
    nullable: true,
    onDelete: 'SET NULL',
    eager: true,
  })
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;

  @AutoMap(() => StatusEntity)
  @ManyToOne(() => StatusEntity, (status) => status.users, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'status_id' })
  status: StatusEntity;

  @AutoMap(() => SellerEntity)
  @OneToOne(() => SellerEntity, (seller) => seller.user, {
    cascade: true,
    eager: true,
  })
  sellerProfile: SellerEntity;

  @AutoMap(() => [OrderEntity])
  @OneToMany(() => OrderEntity, (order) => order.buyer)
  buyerorders: OrderEntity[];

  @AutoMap(() => [ReviewEntity])
  @OneToMany(() => ReviewEntity, (review) => review.buyer)
  reviews: ReviewEntity[];

  @AutoMap(() => [NotificationEntity])
  @OneToMany(() => NotificationEntity, (notification) => notification.user)
  notifications: NotificationEntity[];
}
