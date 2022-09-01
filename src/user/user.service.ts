import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { UserAuth } from '../auth/entities/user-auth.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dtos/register-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject(ConfigService)
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(UserAuth)
    private readonly usersAuthRepository: Repository<UserAuth>,
  ) {}

  async register(userToRegister: RegisterUserDto) {
    try {
      const hashedPassword = await hash(
        userToRegister.password,
        Number(this.configService.get('PASSWORD_SALT')),
      );

      const foundUser = await this.usersRepository.findOneBy({
        email: userToRegister.email,
      });

      if (foundUser) {
        throw new HttpException(
          'User already exists',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const createdUser = await this.usersRepository.save(
        new User(userToRegister),
      );

      await this.usersAuthRepository.save(
        new UserAuth({
          userEmail: userToRegister.email,
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

  /*
  * Further work on User CRUD services
  *
  async createUser(userToCreate: UserDto) {
    try {
      const foundUser = await this.usersRepository.findOneBy({
        email: userToCreate.email,
      });

      if (foundUser) {
        throw new HttpException(
          'User already exists',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const newUser = new User(userToCreate);

      return this.usersRepository.save(newUser);
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  async getUsers() {
    try {
      return this.usersRepository.find();
    } catch (error) {
      throw error;
    }
  }

  async getUser(id: UserDto['id']) {
    try {
      const foundUser = await this.usersRepository.findOneBy({ id: id });

      return foundUser;
    } catch (error) {
      throw error;
    }
  }

  async getUserByEmail(email: UserDto['email']) {
    try {
      const foundUser = await this.usersRepository.findOneBy({ email: email });

      return foundUser;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(email: User['email'], userToUpdate: User) {
    try {
      const foundUser = await this.usersRepository.findOneBy({ email });

      if (!foundUser) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      return this.usersRepository.save({ ...foundUser, ...userToUpdate });
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(email: User['email']) {
    try {
      return this.usersRepository.delete({ email });
    } catch (error) {
      throw error;
    }
  }
  */
}
