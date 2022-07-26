import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/providers/jwt-auth.guard';
import { TransactionService } from '../transaction/transaction.service';
import { UserDto } from './dtos/user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
    @Inject(TransactionService)
    private readonly transactionService: TransactionService,
  ) {}

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

  @Get('/:id/transactions')
  @UseGuards(JwtAuthGuard)
  async getUserTransactions(@Param('id') id: UserDto['id']) {
    const foundUser = await this.userService.getUser(id);

    if (!foundUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return this.transactionService.getUserTransactions(foundUser.email);
  }
}
