import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookEntity } from './book.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateBookDto } from './dto/createBook.dto';
import { BookResponseInterface } from './types/bookResponse.interface';
import { UpdateBookDto } from './dto/updateBook.dto';
import { UserEntity } from '../user/user.entity';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepo: Repository<BookEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async createBook(createBookDto: CreateBookDto): Promise<BookEntity> {
    const book = new BookEntity();

    Object.assign(book, createBookDto);

    return await this.bookRepo.save(book);
  }

  async updateBook(
    updateBookDto: UpdateBookDto,
    bookId: number,
  ): Promise<BookEntity> {
    const book = await this.bookRepo.findOne({ id: bookId });

    if (!book) {
      throw new HttpException('Book does not found', HttpStatus.NOT_FOUND);
    }

    Object.assign(book, updateBookDto);

    return await this.bookRepo.save(book);
  }

  async deleteBook(bookId: number): Promise<DeleteResult> {
    const book = await this.bookRepo.findOne({ id: bookId });

    if (!book) {
      throw new HttpException('Book does not found', HttpStatus.NOT_FOUND);
    }

    return this.bookRepo.delete({ id: bookId });
  }

  async giveBook(
    bookId: number,
    userId: number,
  ): Promise<{ book: BookEntity; user: UserEntity }> {
    const user = await this.userRepo.findOne(
      { id: userId },
      { relations: ['books'] },
    );
    const book = await this.bookRepo.findOne({ id: bookId });
    if (!book) {
      throw new HttpException('Book does not found', HttpStatus.NOT_FOUND);
    }

    if (!user) {
      throw new HttpException('User does not found', HttpStatus.NOT_FOUND);
    }

    if (!user.subscription) {
      throw new HttpException(
        'User have not subscription',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (book.taken) {
      throw new HttpException('Book has taken', HttpStatus.BAD_REQUEST);
    }

    book.taken = true;
    await this.bookRepo.save(book);
    console.log(book);
    console.log(user);

    user.books.push(book);
    await this.userRepo.save(user);

    return { book, user };
  }

  async acceptBook(userId: number, bookId: number) {
    const user = await this.userRepo.findOne(
      { id: userId },
      { relations: ['books'] },
    );
    if (!user) {
      throw new HttpException('User does not found', HttpStatus.NOT_FOUND);
    }

    const book = await this.bookRepo.findOne({ id: bookId });
    if (!book) {
      throw new HttpException('Book does not found', HttpStatus.NOT_FOUND);
    }

    const bookIndex = user.books.findIndex((el) => el.id === book.id);

    if (bookIndex >= 0) {
      user.books.splice(bookIndex, 1);
      book.taken = false;
      await this.bookRepo.save(book);
      await this.userRepo.save(user);
    }

    return { book };
  }

  buildBookResponse(book: BookEntity): BookResponseInterface {
    return { book };
  }
}
