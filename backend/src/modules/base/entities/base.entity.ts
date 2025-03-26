import { AutoMap } from '@automapper/classes';
import {
  CreateDateColumn,
  DeleteDateColumn,
  ObjectLiteral,
  UpdateDateColumn,
} from 'typeorm';

export class BaseEntity implements ObjectLiteral {
  @AutoMap()
  id: string | number;

  @AutoMap(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @AutoMap(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;

  @AutoMap(() => Date)
  @DeleteDateColumn()
  deletedAt: Date;
}
