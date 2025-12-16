import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { User } from './entities/user.entity';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly user: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    const data = new User();
    data.name = createUserDto.name;
    data.age = createUserDto.age;
    data.gender = createUserDto.gender;
    data.password = createUserDto.password;
    data.techs = createUserDto.techs;
    data.profile = createUserDto.profile;
    return this.user.save(data);
  }

  find(query: { keyWord: string }) {
    return this.user.find({
      where: {
        // 模糊查询
        name: Like(`%${query.keyWord}%`),
      },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.user.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.user.delete(id);
  }
}
