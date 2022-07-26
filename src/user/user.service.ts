import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from './dtos/user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

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

  async getUser(id: User['id']) {
    try {
      const foundUser = await this.usersRepository.findOneBy({ id: id });

      return foundUser;
    } catch (error) {
      throw error;
    }
  }

  async getUserByEmail(email: User['email']) {
    try {
      const foundUser = await this.usersRepository.findOneBy({ email: email });

      return foundUser;
    } catch (error) {
      throw error;
    }
  }

  /*
  * Further work on User CRUD services
  *
  * 
  async getUsers() {
    try {
      return this.usersRepository.find();
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
