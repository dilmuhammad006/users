import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.servie';
import { LoginDto, RegisterDto } from './dtos';
import { Protected, Roles } from 'src/decorators';
import { ApiOperation } from '@nestjs/swagger';
import { CheckRole } from 'src/guards';
import { UserRoles } from './enums';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}
  @ApiOperation({ summary: 'Register' })
  @Protected(false)
  @Roles([UserRoles.ADMIN, UserRoles.SUPER_ADMIN, UserRoles.USER])
  @Post('sign-up')
  async Register(@Body() payload: RegisterDto) {
    return this.service.register(payload);
  }

  @ApiOperation({ summary: 'Login' })
  @Protected(false)
  @Roles([UserRoles.ADMIN, UserRoles.SUPER_ADMIN, UserRoles.USER])
  @Post('sign-in')
  async Login(@Body() payload: LoginDto) {
    return this.service.login(payload);
  }
}
