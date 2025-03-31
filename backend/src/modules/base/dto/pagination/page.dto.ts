import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { PageMetaDto } from './page.meta.dto';

export class PageDto<T> {
  @ApiProperty({ isArray: true, type: Object })
  readonly data: T[];

  @ApiProperty()
  readonly meta: PageMetaDto;

  constructor(data: T[], meta: PageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
