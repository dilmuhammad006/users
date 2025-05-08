import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models';
import { CreateDto, DeleteDto, FindByIdDto, UpdateDto } from './dtos';
import { fsHelper } from 'src/helpers';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    private readonly fs: fsHelper,
  ) {}
  async onModuleInit() {
    try {
      await this.fs.MkdirUploads();
      console.log('✅');
    } catch (error) {
      console.log('❌');
    }
  }

  async GetAll() {
    const users = await this.userModel.findAll();

    return {
      message: 'succes',
      count: users.length,
      data: users,
    };
  }

  async FindById(payload: FindByIdDto) {
    const [founded] = await this.userModel.findAll({
      where: { id: payload.id },
    });
    if (!founded) {
      throw new NotFoundException('User not found with given id');
    }

    return {
      message: 'succes',
      data: founded,
    };
  }

  async Create(payload: CreateDto, file: Express.Multer.File) {
    const [founded] = await this.userModel.findAll({
      where: { email: payload.email, password: payload.password },
    });

    if (founded) {
      throw new ConflictException('This User already exists!');
    }

    const image = await this.fs.uploadFile(file);

    const user = await this.userModel.create({
      name: payload.name,
      email: payload.email,
      age: payload.age,
      password: payload.password,
      image: image.fileUrl,
    });

    return {
      message: 'success',
      data: user,
    };
  }

  async Update(payload: UpdateDto, id: number) {
    const [founded] = await this.userModel.findAll({ where: { id: id } });
    if (!founded) {
      throw new NotFoundException('User user not found with given ID');
    }

    const Updateduser = await this.userModel.update(
      { name: payload.name, age: payload.age, password: payload.password },
      { where: { id: id } },
    );
    const user = await this.userModel.findAll({ where: { id: id } });
    return {
      message: 'success',
      data: user,
    };
  }

  async Delete(payload: DeleteDto) {
    const [founded] = await this.userModel.findAll({
      where: { id: payload.id },
    });
    if (!founded) {
      throw new NotFoundException('User user not found with given ID');
    }

    await this.userModel.destroy({ where: { id: payload.id } });

    return {
      message: 'success',
    };
  }
  async UpdateImage(id: number, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }
    const [founded] = await this.userModel.findAll({
      where: { id: id },
    });
    if (!founded) {
      throw new NotFoundException('User user not found with given ID');
    }

    const imagePath = path.join(
      process.cwd(),
      'uploads',
      founded.dataValues.image,
    );

    if (fs.existsSync(imagePath)) {
      await this.fs.unlinkFile(founded.dataValues.image);
    }

    const image = await this.fs.uploadFile(file);

    await this.userModel.update(
      { image: image.fileUrl },
      { where: { id: id } },
    );

    const user = await this.userModel.findAll({ where: { id: id } });
    return {
      message: 'success',
      data: user,
    };
  }
}
