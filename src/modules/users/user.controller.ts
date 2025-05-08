import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { CreateDto, UpdateDto, UpdateImageDto } from './dtos';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UserController {
  constructor(private readonly service: UserService) {}
  @ApiOperation({
    summary: 'Get all users',
  })
  @Get()
  async GetAll() {
    return await this.service.GetAll();
  }

  @ApiOperation({
    summary: 'Get user with ID',
  })
  @Get(':id')
  async FindById(@Param('id', ParseIntPipe) id: number) {
    return await this.service.FindById({ id });
  }

  @ApiOperation({
    summary: 'Create user with image',
  })
  @ApiConsumes('multipart/form-data')
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async Create(
    @Body() body: CreateDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.service.Create(body, file);
  }

  @ApiOperation({
    summary: 'Update user with given id without image',
  })
  @Patch(':id')
  async Update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateDto) {
    return await this.service.Update(body, id);
  }

  @ApiOperation({
    summary: 'Delete user with ID',
  })
  @Delete(':id')
  async Delete(@Param('id', ParseIntPipe) id: number) {
    return await this.service.Delete({ id });
  }

  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update user image' })
  @ApiBody({
    description: 'Image file',
    type: UpdateImageDto,
  })
  @Put('image/:id')
  async UpdateImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.service.UpdateImage(id, file);
  }
}
