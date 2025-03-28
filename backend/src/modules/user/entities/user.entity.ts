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
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AuthProvidersEnum } from '../enum/user.provider';
import { GigEntity } from 'src/modules/gig/entities/gig.entity';
import { UsersGigsEntity } from './users_gigs.entity';

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
  @Column({ type: 'nvarchar', nullable: true })
  country?: string | null;

  @AutoMap()
  @Column({ type: 'varchar', nullable: true })
  avatar?: string | null;

  @AutoMap()
  @Column({ type: 'varchar', length: 50, nullable: true })
  phoneNumber?: string | null;

  /* ROLE */
  @AutoMap()
  @Column({ name: 'role_id', nullable: true })
  roleId?: number | null;

  @AutoMap(() => RoleEntity)
  @ManyToOne(() => RoleEntity, (role) => role.users, {
    onDelete: 'SET NULL', // Khi xóa User, xóa luôn Role liên kết
    eager: true,
  })
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;

  /* STATUS */
  @AutoMap()
  @Column({ name: 'status_id', nullable: true })
  statusId?: number | null;

  @AutoMap(() => StatusEntity)
  @ManyToOne(() => StatusEntity, (status) => status.users, {
    onDelete: 'SET NULL',
    eager: true,
  })
  @JoinColumn({ name: 'status_id' })
  status: StatusEntity;

  /* FREELANCER */
  @AutoMap()
  @Column({ name: 'freelancer_id', nullable: true })
  freelancerId?: string | null;

  @AutoMap(() => FreelancerEntity)
  @OneToOne(() => FreelancerEntity, (freelancer) => freelancer.user, {
    cascade: true,
    eager: true,
  })
  @JoinColumn({ name: 'freelancer_id' })
  freelancer?: FreelancerEntity | null;

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
  @AutoMap(() => [UsersGigsEntity])
  @ManyToMany(() => UsersGigsEntity)
  favoriteGigs: UsersGigsEntity[];
}
