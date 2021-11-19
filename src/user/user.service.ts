import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { RegisterUserDto } from './dto/registerUser.dto';
import { sign } from 'jsonwebtoken';
import { hash, compare } from 'bcrypt';
import JWT_SECRET from './JWT_SECRET';
import { UserResponseInterface } from './types/userResponse.interface';
import { LoginUserDto } from './dto/loginUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UsersResponseInterface } from './types/usersResponse.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
    const existEmail = await this.userRepo.findOne({
      email: registerUserDto.email,
    });

    if (existEmail) {
      throw new HttpException(
        'Email already taken',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const user = new UserEntity();

    user.username = registerUserDto.username;
    user.email = registerUserDto.email;
    user.password = await hash(registerUserDto.password, 12);

    return this.userRepo.save(user);
  }

  async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
    const user = await this.userRepo.findOne({
      email: loginUserDto.email,
    });

    if (!user) {
      throw new HttpException('User does not found', HttpStatus.NOT_FOUND);
    }

    const isEqualPW = await compare(loginUserDto.password, user.password);

    if (!isEqualPW) {
      throw new HttpException(
        'Passwords does not found',
        HttpStatus.BAD_REQUEST,
      );
    }

    delete user.password;

    return user;
  }

  async updateUser(
    updateUserDto: UpdateUserDto,
    userId: number,
  ): Promise<UserEntity> {
    const user = await this.userRepo.findOne({ id: userId });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (updateUserDto.username) {
      user.username = updateUserDto.username;
    }

    if (updateUserDto.email) {
      user.email = updateUserDto.email;
    }

    if (updateUserDto.password) {
      user.email = await hash(updateUserDto.password, 12);
    }

    return this.userRepo.save(user);
  }

  async deleteUser(userId: number): Promise<DeleteResult> {
    const user = await this.userRepo.findOne({ id: userId });

    if (!user) {
      throw new HttpException('User does not found', HttpStatus.NOT_FOUND);
    }

    return await this.userRepo.delete({ id: userId });
  }

  async getUsers(): Promise<UsersResponseInterface> {
    const users = await this.userRepo.find();

    return { users };
  }

  async getUser(userId: number): Promise<UserEntity> {
    const user = await this.userRepo.findOne({ id: userId });

    if (!user) {
      throw new HttpException('User does not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async setSubscribe(userId: number): Promise<UserEntity> {
    const user = await this.userRepo.findOne({ id: userId });

    if (!user) {
      throw new HttpException('User does not found', HttpStatus.NOT_FOUND);
    }

    user.subscription = true;

    return await this.userRepo.save(user);
  }

  generateJWT(user: UserEntity): string {
    return sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
    );
  }

  buildUserResponse(user: UserEntity): UserResponseInterface {
    return {
      user: {
        ...user,
        token: this.generateJWT(user),
      },
    };
  }
}
