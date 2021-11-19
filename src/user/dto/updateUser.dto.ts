import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ type: String, description: 'username' })
  username: string;

  @IsEmail()
  @ApiProperty({ type: String, description: 'email' })
  email: string;

  @ApiProperty({ type: String, description: 'password' })
  password: string;
}
