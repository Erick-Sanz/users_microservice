import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern({ cmd: 'createUser' })
  async create(@Payload() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @MessagePattern({ cmd: 'validateUser' })
  async validateUser(@Payload() loginInput: LoginDto) {
    return await this.usersService.validateUser(loginInput);
  }

  @MessagePattern({ cmd: 'getUsers' })
  async getUsers(@Payload() paginationDto: PaginationDto) {
    return await this.usersService.getUsers(paginationDto);
  }
}
