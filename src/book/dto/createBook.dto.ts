import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookDto {
  @IsNotEmpty()
  @ApiProperty({ type: String, description: 'name' })
  readonly name: string;

  @IsNotEmpty()
  @ApiProperty({ type: String, description: 'author' })
  readonly author: string;
}
