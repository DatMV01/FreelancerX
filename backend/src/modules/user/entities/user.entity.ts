import { AutoMap } from '@automapper/classes';
import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/modules/base/entities/base.entity';
import { FileEntity } from 'src/modules/files/entities/file.entity';
import { FreelancerEntity } from 'src/modules/freelancer/entities/freelancer.entity';
import { NotificationEntity } from 'src/modules/notification/entities/notification.entity';
import { OrderEntity } from 'src/modules/order/entities/order.entity';
import { RatingEntity } from 'src/modules/rating/entities/rating.entity';
import { RoleEntity } from 'src/modules/role/entities/role.entity';
import { StatusEntity } from 'src/modules/status/entities/status.entity';
import { TransactionEntity } from 'src/modules/transaction/entities/transaction.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AuthProvidersEnum } from '../enum/user.provider';

import { GigEntity } from 'src/modules/gig/entities/gig.entity';

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

  @AutoMap(() => String)
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
  @Column({ type: 'nvarchar', nullable: true })
  country?: string;

  @AutoMap()
  @Column({ type: 'varchar', nullable: true })
  avatar?: string = undefined;

  @AutoMap()
  @Column({ type: 'varchar', length: 50, nullable: true })
  phoneNumber?: string;

  /* ROLE */
  @AutoMap()
  @Column({ name: 'role_id', nullable: false })
  roleId?: number;

  @AutoMap(() => RoleEntity)
  @ManyToOne(() => RoleEntity, (role) => role.users, {
    eager: true,
  })
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;

  /* STATUS */
  @AutoMap()
  @AutoMap()
  @Index()
  @Column({
    name: 'status_id',
    // nullable: true,
    type: 'number',
  })
  statusId?: number;

  @AutoMap(() => StatusEntity)
  @ManyToOne(() => StatusEntity, (status) => status.users, {
    eager: true,
  })
  @JoinColumn({ name: 'status_id' })
  status: StatusEntity;

  /* FREELANCER */

  @AutoMap(() => FreelancerEntity)
  @OneToOne(() => FreelancerEntity, (freelancer) => freelancer.user, {
    // eager: true,
  })
  freelancer?: FreelancerEntity;

  /* ORDERS */
  @AutoMap(() => [OrderEntity])
  @OneToMany(() => OrderEntity, (order) => order.buyer)
  buyerorders: OrderEntity[];

  /* RATINGS */
  @AutoMap(() => [RatingEntity])
  @OneToMany(() => RatingEntity, (ratings) => ratings.user)
  ratings: RatingEntity[];

  /* NOTIFICATIONS */
  @AutoMap(() => [NotificationEntity])
  @OneToMany(() => NotificationEntity, (notification) => notification.user)
  notifications: NotificationEntity[];

  /* FILES */
  @AutoMap(() => [FileEntity])
  @OneToMany(() => FileEntity, (file) => file.user)
  files: FileEntity[];

  /* TRANSACTIONS */
  @AutoMap(() => [TransactionEntity])
  @OneToMany(() => TransactionEntity, (transaction) => transaction.user, {
    onDelete: 'RESTRICT', // Ngăn không cho xóa User nếu có Transaction
  })
  transactions: TransactionEntity[];

  /* FAVORITE GIGS */
  // @AutoMap(() => [UsersFavoriteGigsEntity])
  // @OneToMany(() => UsersFavoriteGigsEntity, (_) => _.user)
  // usersFavoriteGigs: UsersFavoriteGigsEntity[];

  @AutoMap(() => [GigEntity])
  @ManyToMany(() => GigEntity, (user) => user.users, {
    cascade: true,
    eager: false,
  })
  @JoinTable({
    name: 'users_favorite_gigs',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'gigId', referencedColumnName: 'id' },
  })
  favoriteGigs: GigEntity[];
}
