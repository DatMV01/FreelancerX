import { AutoMap } from '@automapper/classes';
import { BaseEntity } from 'src/modules/base/entities/base.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('status')
export class StatusEntity extends BaseEntity {
  @AutoMap()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @AutoMap()
  @Column({ unique: true, nullable: false })
  name: string;

  @AutoMap()
  @Column({ type: 'nvarchar', nullable: true })
  description?: string | null;

  @AutoMap(() => [UserEntity])
  @OneToMany(() => UserEntity, (user) => user.status)
  users: UserEntity[];
}
