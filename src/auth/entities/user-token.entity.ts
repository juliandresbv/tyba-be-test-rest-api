import { Column, Entity } from 'typeorm';
import { UserTokenInterface } from '../interfaces/user-token.interface';

@Entity({ name: 'users_token' })
export class UserToken implements UserTokenInterface {
  @Column({ primary: true, name: 'user_email' })
  userEmail: string;

  @Column()
  token: string;

  @Column({ default: true })
  valid: boolean;

  constructor(init: Partial<UserTokenInterface>) {
    return Object.assign(this, init);
  }
}
