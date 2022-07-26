import { Column, Entity, Generated } from 'typeorm';
import { UserInterface } from '../interfaces/user.interface';

@Entity({ name: 'users' })
export class User implements UserInterface {
  @Column()
  @Generated('increment')
  id?: number;

  @Column({ primary: true })
  email: string;

  @Column({ name: 'first_name' })
  firstName: string;

  constructor(init: Partial<UserInterface>) {
    return Object.assign(this, init);
  }
}
