import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/createBook.dto';
import { BookResponseInterface } from './types/bookResponse.interface';
import { AdminGuard } from '../user/guards/admin.guard';
import { AuthGuard } from '../user/guards/auth.guard';
import { UpdateBookDto } from './dto/updateBook.dto';
import { DeleteResult } from 'typeorm';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('book')
@ApiBearerAuth('access-token')
@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @ApiUnauthorizedResponse({ description: 'UNAUTHORIZED' })
  @ApiCreatedResponse({ description: 'Book created' })
  @ApiBody({ type: CreateBookDto })
  @UseGuards(AdminGuard)
  @UsePipes(new ValidationPipe())
  async createBook(
    @Body() createBookDto: CreateBookDto,
  ): Promise<BookResponseInterface> {
    const book = await this.bookService.createBook(createBookDto);
    return this.bookService.buildBookResponse(book);
  }

  @Put(':bookId')
  @ApiUnauthorizedResponse({ description: 'UNAUTHORIZED' })
  @ApiOkResponse({ description: 'Book updated' })
  @ApiBody({ type: UpdateBookDto })
  @ApiParam({
    name: 'id',
    type: 'Number',
    description: 'User id',
    required: true,
  })
  @UseGuards(AuthGuard, AdminGuard)
  @UsePipes(new ValidationPipe())
  async updateBook(
    @Param('bookId') bookId: number,
    @Body() updateBookDto: UpdateBookDto,
  ): Promise<BookResponseInterface> {
    const book = await this.bookService.updateBook(updateBookDto, bookId);
    return this.bookService.buildBookResponse(book);
  }

  @Delete(':bookId')
  @ApiUnauthorizedResponse({ description: 'UNAUTHORIZED' })
  @ApiOkResponse({ description: 'Book deleted' })
  @ApiParam({
    name: 'id',
    type: 'Number',
    description: 'User id',
    required: true,
  })
  @UseGuards(AuthGuard, AdminGuard)
  async deleteBook(@Param('bookId') bookId: number): Promise<DeleteResult> {
    return this.bookService.deleteBook(bookId);
  }

  @Post(':bookId/:userId')
  @ApiUnauthorizedResponse({ description: 'UNAUTHORIZED' })
  @ApiOkResponse({ description: 'Give the book' })
  @ApiParam({
    name: 'id',
    type: 'Number',
    description: 'User id and book id',
    required: true,
  })
  @UseGuards(AuthGuard, AdminGuard)
  async giveBook(
    @Param('bookId') bookId: number,
    @Param('userId') userId: number,
  ) {
    return await this.bookService.giveBook(bookId, userId);
  }

  @Delete(':bookId/:userId')
  @ApiUnauthorizedResponse({ description: 'UNAUTHORIZED' })
  @ApiOkResponse({ description: 'Accept the book' })
  @ApiParam({
    name: 'id',
    type: 'Number',
    description: 'User id and book id',
    required: true,
  })
  @UseGuards(AuthGuard, AdminGuard)
  async acceptBook(
    @Param('bookId') bookId: number,
    @Param('userId') userId: number,
  ) {
    return this.bookService.acceptBook(userId, bookId);
  }
}
