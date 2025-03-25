import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  Response,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { CurrentUser } from 'src/common/decorators';
import { setTimeout } from 'timers/promises';
import { FileLocalService } from './file.service';
import { FileResponseDto } from './uploader/local/dto/file-response.dto';

@Controller({
  path: 'file',
  version: '1',
})
export class FileController {
  constructor(private readonly filesService: FileLocalService) {}

  @Post('upload')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() currentUser: any,
  ): Promise<FileResponseDto> {
    return this.filesService.create(file, currentUser);
  }

  @Delete()
  @UseGuards(AuthGuard('jwt'))
  async deleteFile(
    @Query('filename') filename: string,
    @Query('id') id: string,
    @CurrentUser() currentUser: any,
  ) {
    if (id && currentUser) {
      const deleted = await this.filesService.deleteFileByID(
        id,
        currentUser,
      );
      if (!deleted) {
        throw new HttpException(
          'File not found or cannot be deleted',
          HttpStatus.BAD_REQUEST,
        );
      }

      return { message: `File ${id} deleted successfully` };
    }

    if (filename) {
      const deleted = await this.filesService.deleteFileByName(filename);
      if (!deleted) {
        throw new HttpException(
          'File not found or cannot be deleted',
          HttpStatus.BAD_REQUEST,
        );
      }

      return { message: `File ${filename} deleted successfully` };
    }
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
