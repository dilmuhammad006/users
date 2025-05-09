import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    type: 'string',
    required: true,
    example: 'foo',
  })
  @IsString()
  @MinLength(2)
  name: string;
  //
  @ApiProperty({
    type: 'string',
    required: true,
    example: 'foo@gmail.com',
  })
  @MinLength(4)
  @IsEmail()
  email: string;
  //

  @ApiProperty({
    type: 'string',
    required: true,
    example: 'foo123',
  })
  @IsString()
  @MinLength(4)
  password: string;
}
