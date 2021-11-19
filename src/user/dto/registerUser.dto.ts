import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @IsNotEmpty()
  @ApiProperty({ type: String, description: 'username' })
  username: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ type: String, description: 'email' })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ type: String, description: 'password' })
  password: string;
}
