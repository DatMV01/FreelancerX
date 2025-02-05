import { AutoMap } from '@automapper/classes';
import { BaseEntity } from 'src/modules/base/entities/base.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'file' })
export class FileEntity extends BaseEntity {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap()
  @Column()
  path: string;
}
