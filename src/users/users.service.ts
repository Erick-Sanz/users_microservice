import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { RpcException } from '@nestjs/microservices';
import { LoginDto } from './dto/login.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
const bcrypt = require('bcrypt');

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { userName, email, password, phoneNumber } = createUserDto;
    const user = await this.userModel
      .findOne(
        {
          $or: [{ email }, { userName }, { phoneNumber }],
        },
        { email: 1, userName: 1, phoneNumber: 1 },
      )
      .lean();
    if (user?.userName === userName) {
      throw new RpcException({
        message: `The username: ${user.userName} is already in use`,
        status: HttpStatus.CONFLICT,
      });
    }
    if (user?.email === email) {
      throw new RpcException({
        message: `The email: ${user.email} is already in use`,
        status: HttpStatus.CONFLICT,
      });
    }
    if (user?.phoneNumber === phoneNumber) {
      throw new RpcException({
        message: `The phone number: ${user.phoneNumber} is already in use`,
        status: HttpStatus.CONFLICT,
      });
    }
    const encryptPassword = await bcrypt.hash(password, 10);
    createUserDto.password = encryptPassword;
    return await this.userModel.create(createUserDto);
  }

  async validateUser(loginInput: LoginDto) {
    const { userNameOrPhoneNumber, password } = loginInput;
    const user = await this.userModel
      .findOne({
        $or: [
          { userName: userNameOrPhoneNumber },
          { phoneNumber: userNameOrPhoneNumber },
        ],
      })
      .lean();
    if (!user) {
      throw new RpcException({
        message: `The username or password is incorrect`,
        status: HttpStatus.CONFLICT,
      });
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      throw new RpcException({
        message: `The username or password is incorrect`,
        status: HttpStatus.CONFLICT,
      });
    }
    user.password = null;
    return user;
  }

  async getUsers(paginationDto: PaginationDto) {
    const { skip, limit } = paginationDto;
    return await this.userModel
      .find({
        isDeleted: false,
      })
      .skip(skip)
      .limit(limit)
      .lean();
  }
}
