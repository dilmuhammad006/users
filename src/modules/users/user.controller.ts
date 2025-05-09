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
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
} from '@nestjs/swagger';
import { CreateDto, UpdateDto, UpdateImageDto } from './dtos';
import { FileInterceptor } from '@nestjs/platform-express';
import { Protected, Roles } from 'src/decorators';
import { UserRoles } from './enums';

@Controller('users')
export class UserController {
  constructor(private readonly service: UserService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users' })
  @Protected(true)
  @Roles([UserRoles.ADMIN, UserRoles.SUPER_ADMIN])
  @Get()
  async GetAll() {
    return await this.service.GetAll();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user with ID' })
  @Protected(true)
  @Roles([UserRoles.ADMIN, UserRoles.SUPER_ADMIN])
  @Get(':id')
  async FindById(@Param('id', ParseIntPipe) id: number) {
    return await this.service.FindById({ id });
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create user with image' })
  @ApiConsumes('multipart/form-data')
  @Protected(true)
  @Roles([UserRoles.ADMIN, UserRoles.SUPER_ADMIN])
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async Create(
    @Body() body: CreateDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.service.Create(body, file);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user with given id without image' })
  @Protected(true)
  @Roles([UserRoles.ADMIN, UserRoles.SUPER_ADMIN, UserRoles.USER])
  @Patch(':id')
  async Update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateDto) {
    return await this.service.Update(body, id);
  }

  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update user image' })
  @ApiBody({
    description: 'Image file',
    type: UpdateImageDto,
  })
  @Protected(true)
  @Roles([UserRoles.ADMIN, UserRoles.SUPER_ADMIN, UserRoles.USER])
  @Put('image/:id')
  async UpdateImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.service.UpdateImage(id, file);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user with ID' })
  @Protected(true)
  @Delete(':id')
  async Delete(@Param('id', ParseIntPipe) id: number) {
    return await this.service.Delete({ id });
  }
}
