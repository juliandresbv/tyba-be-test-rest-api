import { UserInterface } from '../interfaces/user.interface';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto implements UserInterface {
  id?: number;

  @ApiProperty({
    name: 'email',
    type: String,
    description: 'user email',
  })
  email: string;

  @ApiProperty({
    name: 'firstName',
    type: String,
    description: 'user first name',
  })
  firstName: string;

  @ApiProperty({
    name: 'password',
    type: String,
    description: 'user password',
  })
  password?: string;
}
