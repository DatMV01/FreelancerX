import { AutoMap } from '@automapper/classes';
import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/modules/base/entities/base.entity';
import { FileEntity } from 'src/modules/files/entities/file.entity';
import { NotificationEntity } from 'src/modules/notification/entities/notification.entity';
import { OrderEntity } from 'src/modules/order/entities/order.entity';
import { ReviewEntity } from 'src/modules/review/entities/review.entity';
import { RoleEntity } from 'src/modules/roles/entities/role.entity';
import { SellerEntity } from 'src/modules/seller/entities/seller.entity';
import { StatusEntity } from 'src/modules/status/entities/status.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { AuthProvidersEnum } from '../enum/user.provider';

@Entity({
  name: 'user',
})
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
  @OneToMany(() => OrderEntity, (order) => order.buyer, {
    eager: false,
    cascade: true,
  })
  buyerorders: OrderEntity[];

  @AutoMap(() => [ReviewEntity])
  @OneToMany(() => ReviewEntity, (review) => review.buyer, {
    eager: false,
    cascade: true,
  })
  reviews: ReviewEntity[];

  @AutoMap(() => [NotificationEntity])
  @OneToMany(() => NotificationEntity, (notification) => notification.user, {
    eager: false,
    cascade: true,
  })
  notifications: NotificationEntity[];

  @AutoMap(() => [FileEntity])
  @OneToMany(() => FileEntity, (files) => files.user, {
    eager: false,
    cascade: true,
  })
  files: FileEntity[];
}
