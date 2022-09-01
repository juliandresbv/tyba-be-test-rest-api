import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/providers/jwt-auth.guard';
import { TransactionService } from '../transaction/transaction.service';
import { UserDto } from './dtos/user.dto';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { ApiParam } from '@nestjs/swagger';
import { RegisterUserDto } from './dtos/register-user.dto';

@Controller('users')
export class UserController {
  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
    @Inject(TransactionService)
    private readonly transactionService: TransactionService,
  ) {}

  /**
   * @description -- register registers a new user
   * @param -- user to register
   * @returns -- registered user
   */
  @Post()
  @ApiBody({ type: RegisterUserDto })
  async register(@Body() user: RegisterUserDto) {
    return this.userService.register(user);
  }

  /**
   * @description -- getUserTransactions get the user transactions (if authorized)
   * @param id -- user id
   * @returns -- the user transactions
   */
  @Get('/:id/transactions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('token')
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
  })
  async getUserTransactions(@Param('id') id: UserDto['id']) {
    return this.transactionService.getUserTransactions(id);
  }

  /*
  * Further work on User CRUD services
  *
  * 
  @Post()
  async createUser(@Body() user: UserDto) {
    return this.userService.createUser(user);
  }

  @Get()
  async getUsers() {
    return this.userService.getUsers();
  }

  @Get('/:email')
  async getUser(@Param('email') email: UserDto['email']) {
    return this.userService.getUser(email);
  }

  @Put('/:email')
  async updateUser(
    @Param('email') email: UserDto['email'],
    @Body() user: UserDto,
  ) {
    return this.userService.updateUser(email, user);
  }

  @Delete('/:email')
  async deleteUser(@Param('email') email) {
    return this.userService.deleteUser(email);
  }
  */
}
