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
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiParam } from '@nestjs/swagger';

@Controller('users')
export class UserController {
  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
    @Inject(TransactionService)
    private readonly transactionService: TransactionService,
  ) {}

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
  async getUserTransactions(
    @Param('id')
    id: UserDto['id'],
  ) {
    const foundUser = await this.userService.getUser(id);

    if (!foundUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return this.transactionService.getUserTransactions(foundUser.email);
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
