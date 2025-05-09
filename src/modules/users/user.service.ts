import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models';
import {
  CreateDto,
  DeleteDto,
  FindByIdDto,
  GetAllDto,
  UpdateDto,
} from './dtos';
import { fsHelper } from 'src/helpers';
import * as fs from 'fs';
import * as path from 'path';
import { UserRoles } from './enums';
import * as bcrypt from 'bcryptjs';
import { count } from 'console';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    private readonly fs: fsHelper,
  ) {}
  async onModuleInit() {
    try {
      await this.fs.MkdirUploads();
      await this.#seedSuperAdmin();
      console.log('✅');
    } catch (error) {
      console.log('❌');
    }
  }

  async GetAll(payload: GetAllDto) {
    const skip = (payload.page - 1) * payload.limit;
    const users = await this.userModel.findAll({
      limit: payload.limit,
      offset: skip,
      order: [[payload.sorrtField || 'id', payload.sortOrder || 'ASC']],
    });

    return {
      message: 'succes',
      count: users.length,
      page: payload.page,
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

  async #seedSuperAdmin() {
    try {
      const SuperAdmin = [
        {
          name: 'Dilmuhammad',
          email: 'dilmuhammadabdumalikov06@gmail.com',
          password: '20060524',
          role: UserRoles.SUPER_ADMIN,
        },
      ];

      for (let u of SuperAdmin) {
        const user = await this.userModel.findOne({
          where: { email: u.email },
        });

        if (!user) {
          const hashedPassword = await bcrypt.hash(u.password, 10);

          await this.userModel.create({
            name: u.name,
            email: u.email,
            password: hashedPassword,
            role: u.role,
          });
        }
      }
      console.log('✅');
    } catch (error) {
      console.log(error.message);
    }
  }
}
