import { UserInterface } from '../../user/interfaces/user.interface';

export class RegisterUserDto implements UserInterface {
  readonly email: string;
  readonly firstName: string;
  readonly password: string;
}
