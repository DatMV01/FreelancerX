import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  Response,
  UseInterceptors,
  Request,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { FilesLocalService } from './files.service';
import { FileResponseDto } from './uploader/local/dto/file-response.dto';
import { join } from 'path';
import {setTimeout} from 'timers/promises'
@Controller({
  path: 'files',
  version: '1',
})
export class FilesController {
  constructor(private readonly filesService: FilesLocalService) {}

  @Post('upload')
  // @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<FileResponseDto> {
    await setTimeout(2000)
    return this.filesService.create(file);
  }

  @Get('/*path')
  download(@Param('path') path, @Response() response) {
    const filePath = join(...path);

    return response.sendFile(filePath, { root: './public' });
  }

  // @Get(':path')
  // download(@Param('path') path, @Response() response) {
  //   console.log(path);

  //   return response.sendFile(path, { root: './public/images' });
  // }
}
