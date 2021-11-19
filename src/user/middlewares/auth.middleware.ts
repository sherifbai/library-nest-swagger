import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { ExpressRequestInterface } from '../../types/expressRequest.interface';
import { verify } from 'jsonwebtoken';
import JWT_SECRET from '../JWT_SECRET';
import { UserEntity } from '../user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async use(req: ExpressRequestInterface, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      req.user = null;
      next();
      return;
    }

    const token = authHeader.split(' ')[1];
    try {
      const decode = verify(token, JWT_SECRET);
      req.user = await this.userRepo.findOne({ id: decode.id });
      next();
    } catch (error) {
      req.user = null;
      next();
    }
  }
}
