import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    name: 'email',
    type: String,
    description: 'user email',
    example: '1@email.com',
  })
  email: string;

  @ApiProperty({
    name: 'password',
    type: String,
    description: 'user password',
    example: 'pwd1',
  })
  password: string;
}
