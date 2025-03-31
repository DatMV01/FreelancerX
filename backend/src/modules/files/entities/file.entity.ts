import { AutoMap } from '@automapper/classes';
import { BaseEntity } from 'src/modules/base/entities/base.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FileDriver } from '../config/file.config';

@Entity({ name: 'file' })
export class FileEntity extends BaseEntity {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap()
  @Column()
  url: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  mimeType?: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    default: FileDriver.LOCAL,
  })
  provider?: string;

  @AutoMap()
  @Index()
  @ManyToOne(() => UserEntity, (user) => user.files, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
