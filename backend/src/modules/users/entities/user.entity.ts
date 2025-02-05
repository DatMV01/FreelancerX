import { AutoMap } from '@automapper/classes';
import { BaseEntity } from 'src/modules/base/entities/base.entity';
import { FileEntity } from 'src/modules/files/entities/file.entity';
import { RoleEntity } from 'src/modules/roles/entities/role.entity';
import { StatusEntity } from 'src/modules/status/entities/status.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
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
  @Column({ type: String, unique: true, nullable: true })
  email: string | null;

  @AutoMap()
  @Column({ nullable: true })
  password?: string;

  @AutoMap()
  @Column({ default: 'email' })
  provider: string;

  @AutoMap()
  @Index()
  @Column({ type: String, nullable: true })
  socialId?: string | null;

  @AutoMap()
  @Index()
  @Column({ type: String, nullable: true })
  firstName: string | null;

  @AutoMap()
  @Index()
  @Column({ type: String, nullable: true })
  lastName: string | null;

  @AutoMap()
  @OneToOne(() => FileEntity, {
    eager: true,
  })
  @JoinColumn()
  photo?: FileEntity | null;

  @AutoMap()
  @ManyToOne(() => RoleEntity, {
    eager: true,
  })
  role?: RoleEntity;

  @AutoMap()
  @ManyToOne(() => StatusEntity, {
    eager: true,
  })
  status?: StatusEntity;
}
