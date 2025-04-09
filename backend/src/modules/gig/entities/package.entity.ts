import { BaseEntity } from 'src/modules/base/entities/base.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { GigEntity } from './gig.entity';

export enum PackageType {
  BASIC = 'basic',
  STANDARD = 'standard',
  PREMIUM = 'premium',
}

export class PackageFeature {
  package: string;
  value: string;
}

@Entity('gig_packages')
export class PackageEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => GigEntity, (gig) => gig.packages, { onDelete: 'CASCADE' })
  gig: GigEntity;

  @Column({ type: 'enum', enum: PackageType })
  type: PackageType;

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
}
