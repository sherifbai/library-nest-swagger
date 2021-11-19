import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ type: String, description: 'email' })
  readonly email: string;

  @IsNotEmpty()
  @ApiProperty({ type: String, description: 'password' })
  readonly password: string;
}
