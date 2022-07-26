import { UserInterface } from '../interfaces/user.interface';

export class UserDto implements UserInterface {
  id?: number;
  email: string;
  firstName: string;
  password?: string;
}
