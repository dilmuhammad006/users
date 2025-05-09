import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { fsHelper } from 'src/helpers';
import { AuthService } from './auth.servie';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret: 'test-key',
      signOptions: {
        expiresIn: 6000,
      },
    }),
  ],
  controllers: [UserController, AuthController],
  providers: [UserService, AuthService, fsHelper],
})
export class UserModule {}
