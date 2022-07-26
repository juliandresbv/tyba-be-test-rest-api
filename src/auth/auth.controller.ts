import {
  Body,
  Controller,
  Inject,
  Post,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { UserDto } from '../user/dtos/user.dto';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dtos/register-user.dto';
import { JwtAuthGuard } from './providers/jwt-auth.guard';
import { ApiBody } from '@nestjs/swagger';
import { LoginUserDto } from './dtos/login-user.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthService)
    private readonly authService: AuthService,
  ) {}

  /**
   * @description -- register registers a new user
   * @param -- user to register
   * @returns -- registered user
   */
  @Post('/register')
  @ApiBody({ type: RegisterUserDto })
  async register(@Body() user: RegisterUserDto) {
    return this.authService.register(user);
  }

  /**
   * @description -- login starts a user session (if credentials are valid)
   * @param -- user credentials
   * @returns -- user properties or claims (except password) and token
   */
  @Post('/login')
  @ApiBody({ type: LoginUserDto })
  async login(@Body() credentials: Partial<UserDto>) {
    return this.authService.login(credentials);
  }

  /**
   * @description -- logout finishes a user session (if authorized)
   * @param -- headers to extract token from
   * @returns -- void
   */
  @Post('/logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('token')
  async logout(@Headers() headers: any) {
    const token = (headers?.authorization as string).split(' ')[1];

    return this.authService.logout(token);
  }
}
