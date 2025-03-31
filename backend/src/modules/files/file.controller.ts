import {
  BadRequestException,
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
import { JwtAccessPayloadType } from '../auth/strategies/types/jwt-access-payload.type';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import validator from 'validator';

@Controller({
  path: 'file',
  version: '1',
})
export class FileController {
  constructor(private readonly filesService: FileLocalService) {}

  @Post('upload')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  //@ApiBearerAuth()
  @ApiOperation({ summary: 'Upload a file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'File uploaded successfully',
    type: FileResponseDto,
  })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() currentUser: JwtAccessPayloadType,
  ): Promise<FileResponseDto> {
    return this.filesService.create(file, currentUser);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  //@ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a file by ID or filename' })
  @ApiResponse({ status: 200, description: 'File deleted successfully' })
  @ApiResponse({
    status: 400,
    description: 'File not found or cannot be deleted',
  })
  async deleteFile(
    @Param('id') id: string,
    @CurrentUser() currentUser: JwtAccessPayloadType,
  ) {
    if (!validator.isUUID(id)) {
      throw new BadRequestException();
    }

    const deleted = await this.filesService.deleteFileByID(id, currentUser);
    if (!deleted) {
      throw new HttpException(
        'File not found or cannot be deleted',
        HttpStatus.BAD_REQUEST,
      );
    }

    return { message: `File ${id} deleted successfully` };
  }

  @Delete('/name/:name')
  @UseGuards(AuthGuard('jwt'))
  //@ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a file by filename' })
  @ApiResponse({ status: 200, description: 'File deleted successfully' })
  @ApiResponse({
    status: 400,
    description: 'File not found or cannot be deleted',
  })
  async deleteFileByName(
    @Param('name') name: string,
    @CurrentUser() currentUser: JwtAccessPayloadType,
  ) {
    if (validator.isEmpty(name)) {
      throw new BadRequestException();
    }

    const deleted = await this.filesService.deleteFileByName(
      name,
      currentUser,
    );
    
    if (!deleted) {
      throw new HttpException(
        'File not found or cannot be deleted',
        HttpStatus.BAD_REQUEST,
      );
    }

    return { message: `File ${name} deleted successfully` };
  }

  @Get('/*path')
  @ApiOperation({ summary: 'Download a file' })
  @ApiResponse({ status: 200, description: 'File downloaded successfully' })
  download(@Param('path') path, @Response() response) {
    const filePath = join(...path);

    return response.sendFile(filePath, { root: './public' });
  }
}
