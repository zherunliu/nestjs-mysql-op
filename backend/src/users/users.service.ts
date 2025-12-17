import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { User } from './entities/user.entity';

export interface IQuery {
  keyWord: string;
  page: number;
  pageSize: number;
}

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

  async find(query: IQuery) {
    const data = await this.user.find({
      where: {
        // 模糊查询
        name: Like(`%${query.keyWord}%`),
      },
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
    });
    const total = await this.user.count({
      where: {
        // 模糊查询
        name: Like(`%${query.keyWord}%`),
      },
    });
    return { data, total };
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.user.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.user.delete(id);
  }
}
