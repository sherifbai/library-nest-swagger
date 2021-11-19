import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/registerUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { AuthGuard } from './guards/auth.guard';
import { User } from './decorators/user.decorator';
import { AdminGuard } from './guards/admin.guard';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UserResponseInterface } from './types/userResponse.interface';
import { DeleteResult } from 'typeorm';
import { UsersResponseInterface } from './types/usersResponse.interface';
import { UserEntity } from './user.entity';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('user')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('users')
  @ApiUnauthorizedResponse({ description: 'UNAUTHORIZED' })
  @ApiOkResponse({ description: 'List of users' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard, AdminGuard)
  async getUsers(): Promise<UsersResponseInterface> {
    return await this.userService.getUsers();
  }

  @Get('user/:id')
  @ApiOkResponse({ description: 'Get user' })
  @ApiParam({
    name: 'id',
    type: 'Number',
    description: 'User id',
    required: true,
  })
  async getUser(@Param('id') userId: number): Promise<UserEntity> {
    return await this.userService.getUser(userId);
  }

  @Post('user/register')
  @ApiCreatedResponse({ description: 'User registration' })
  @ApiBody({ type: RegisterUserDto })
  @UsePipes(new ValidationPipe())
  async register(@Body() registerUserDto: RegisterUserDto) {
    const user = await this.userService.register(registerUserDto);
    return this.userService.buildUserResponse(user);
  }

  @Post('user/login')
  @ApiOkResponse({ description: 'User login' })
  @ApiUnauthorizedResponse({ description: 'UNAUTHORIZED' })
  @ApiBody({ type: LoginUserDto })
  @UsePipes(new ValidationPipe())
  async login(@Body() loginUserDto: LoginUserDto) {
    const user = await this.userService.login(loginUserDto);
    return this.userService.buildUserResponse(user);
  }

  @Put('user/update')
  @ApiUnauthorizedResponse({ description: 'UNAUTHORIZED' })
  @ApiOkResponse({ description: 'User updated' })
  @ApiBody({ type: UpdateUserDto })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  async updateUser(
    @User('id') userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.updateUser(updateUserDto, userId);
    return this.userService.buildUserResponse(user);
  }

  @Delete('user/:id/delete')
  @UseGuards(AuthGuard, AdminGuard)
  @ApiUnauthorizedResponse({ description: 'UNAUTHORIZED' })
  @ApiOkResponse({ description: 'User deleted' })
  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'id',
    type: 'Number',
    description: 'User id',
    required: true,
  })
  async deleteUser(@Param('id') userId: number): Promise<DeleteResult> {
    return this.userService.deleteUser(userId);
  }

  @Post('user/:userId/subscribe')
  @ApiUnauthorizedResponse({ description: 'UNAUTHORIZED' })
  @ApiOkResponse({ description: 'Set subscribe' })
  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'id',
    type: 'Number',
    description: 'User id',
    required: true,
  })
  @UseGuards(AuthGuard, AdminGuard)
  async setSubscribe(@Param('userId') userId: number) {
    const user = await this.userService.setSubscribe(userId);

    return this.userService.buildUserResponse(user);
  }
}
