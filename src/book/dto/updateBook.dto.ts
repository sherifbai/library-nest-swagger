import { ApiProperty } from '@nestjs/swagger';

export class UpdateBookDto {
  @ApiProperty({ type: String, description: 'name' })
  readonly name: string;

  @ApiProperty({ type: String, description: 'author' })
  readonly author: string;
}
