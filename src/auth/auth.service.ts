import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAuth } from './entities/user-auth.entity';
import { compare } from 'bcrypt';
import { UserDto } from '../user/dtos/user.dto';
import { JwtService } from '@nestjs/jwt';
import { UserToken } from './entities/user-token.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(UserAuth)
    private readonly usersAuthRepository: Repository<UserAuth>,
    @InjectRepository(UserToken)
    private readonly usersTokenRepository: Repository<UserToken>,

    @Inject(JwtService)
    private readonly jwtService: JwtService,
  ) {}

  async login(credentials: Partial<UserDto>) {
    try {
      const foundUser = await this.usersRepository.findOneBy({
        email: credentials.email,
      });
      const foundUserAuth = await this.usersAuthRepository.findOneBy({
        userEmail: credentials.email,
      });

      if (!foundUser || !foundUserAuth) {
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      }

      const isUserPassword = await compare(
        credentials?.password,
        foundUserAuth.password,
      );

      if (!isUserPassword) {
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      }

      const token = this.jwtService.sign({
        email: foundUser.email,
        firstName: foundUser.firstName,
      });

      await this.usersTokenRepository.save(
        new UserToken({
          userEmail: foundUser.email,
          token: token,
          valid: true,
        }),
      );

      return {
        ...foundUser,
        token: token,
      };
    } catch (error) {
      throw error;
    }
  }

  async logout(token: string) {
    try {
      const foundUserToken = await this.usersTokenRepository.findOneBy({
        token: token,
      });

      if (!foundUserToken) {
        throw new HttpException(
          'Log out error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      foundUserToken.valid = false;

      await this.usersTokenRepository.save(foundUserToken);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Further work on User CRUD services
   * 
  async register(user: UserDto) {
    try {
      const createdUser = await this.userService.createUser({
        email: user.email,
        firstName: user.firstName,
      });

      const hashedPassword = await hash(user.password, 7);
      await this.usersAuthRepository.save(
        new UserAuth({
          userEmail: user.email,
          password: hashedPassword,
        }),
      );

      return {
        id: createdUser.id,
        email: createdUser.email,
        firstName: createdUser.firstName,
      };
    } catch (error) {
      throw error;
    }
  }
  */
}
