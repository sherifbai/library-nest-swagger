import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { BookEntity } from './book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BookEntity, UserEntity])],
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule {}
