import {
  ArgumentMetadata,
  HttpStatus,
  Injectable,
  PipeTransform,
  UnprocessableEntityException,
} from '@nestjs/common';
import { StatusDto } from 'src/modules/status/dto/status.dto';
import { StatusEnum } from 'src/modules/status/enum/statuses.enum';

@Injectable()
export class StatusTransformPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value.status) return;

    const status = String(value.status).toUpperCase();

    if (!Object.values(StatusEnum).includes(status)) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: { status: 'statusNotExists' },
      });
    }

    return {
      ...value,
      status: {
        id: StatusEnum[status],
      } as StatusDto,
    };
  }
}
