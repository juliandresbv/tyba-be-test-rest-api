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
import { JwtAuthGuard } from './providers/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthService)
    private readonly authService: AuthService,
  ) {}

  @Post('/register')
  async register(@Body() user: UserDto) {
    return this.authService.register(user);
  }

  @Post('/login')
  async login(@Body() credentials: Partial<UserDto>) {
    return this.authService.login(credentials);
  }

  @Post('/logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Headers() headers: any) {
    const token = (headers?.authorization as string).split(' ')[1];

    return this.authService.logout(token);
  }
}
