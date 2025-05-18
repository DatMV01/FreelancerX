import { BaseEntity } from 'src/modules/base/entities/base.entity';
import { OrderEntity } from 'src/modules/order/entities/order.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GigEntity } from './gig.entity';
import { AutoMap } from '@automapper/classes';

// export enum GigPackageType {
//   BASIC = 'BASIC',
//   STANDARD = 'STANDARD',
//   PREMIUM = 'PREMIUM',
// }

export enum GigPackageType {
  BASIC = 'basic',
  STANDARD = 'standard',
  PREMIUM = 'premium',
}

export class PackageFeature {
  package: string;
  value: string;
}

@Entity('gig_packages')
export class GigPackagesEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap()
  @Column({
    name: 'gig_id',
    nullable: false,
    type: 'char',
    length: 36,
  })
  gigId: string;

  @ManyToOne(() => GigEntity, (gig) => gig.packages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'gig_id' })
  gig: GigEntity;

  @Column({ type: 'enum', enum: GigPackageType })
  type: GigPackageType;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('int')
  price: number;

  @Column('int')
  deliveryTime: number;

  @Column('int')
  revisions: number;

  @Column('json', { nullable: true })
  features: PackageFeature[];

  @OneToMany(() => OrderEntity, (language) => language.package, {
    eager: false,
  })
  orders: OrderEntity;
}
