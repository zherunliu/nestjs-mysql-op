import { Gender, IProfile } from '../entities/user.entity';

export class CreateUserDto {
  name: string;
  age: number;
  gender: Gender;
  password: string;
  techs: string[];
  profile: IProfile;
}
