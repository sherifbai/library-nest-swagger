import { UserEntity } from '../user.entity';

export interface UserResponseInterface {
  user: UserEntity & { token: string };
}
