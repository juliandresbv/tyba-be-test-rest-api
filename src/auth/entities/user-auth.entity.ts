import { Column, Entity } from 'typeorm';
import { UserAuthInterface } from '../interfaces/user-auth.interface';

@Entity({ name: 'users_auth' })
export class UserAuth {
  @Column({ primary: true, name: 'user_email' })
  userEmail: string;

  @Column()
  password: string;

  constructor(init: Partial<UserAuthInterface>) {
    return Object.assign(this, init);
  }
}
