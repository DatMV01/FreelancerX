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
import { FileTypeEnum } from '../enum/file.enum';

@Entity({ name: 'file' })
export class FileEntity extends BaseEntity {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap()
  @Column()
  url: string;

  // @Column({
  //   type: 'enum',
  //   enum: FileTypeEnum,
  //   default: FileTypeEnum.OTHER,
  // })
  @Column({ type: 'varchar', length: 20, nullable: true })
  mimeType?: string;

  @Column({ type: 'varchar', length: 20, nullable: true, default: 'local' })
  provider?: string;

  @AutoMap()
  @Index()
  @ManyToOne(() => UserEntity, (user) => user.files, {
    onDelete: 'CASCADE', // user xóa, file xóa theo
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
