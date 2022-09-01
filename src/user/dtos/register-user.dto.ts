import { UserInterface } from '../../user/interfaces/user.interface';
import { ApiProperty } from '@nestjs/swagger';
export class RegisterUserDto implements UserInterface {
  @ApiProperty({
    name: 'email',
    type: String,
    description: 'user email',
    example: '1@email.com',
  })
  email: string;

  @ApiProperty({
    name: 'firstName',
    type: String,
    description: 'user first name',
    example: 'fn1',
  })
  firstName: string;

  @ApiProperty({
    name: 'password',
    type: String,
    description: 'user password',
    example: 'pwd1',
  })
  password?: string;
}
