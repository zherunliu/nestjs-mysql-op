import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Tag } from './entities/tag.entity';

export interface IQuery {
  keyWord: string;
  page: number;
  pageSize: number;
}

export interface ITagParams {
  tags: string[];
  userId: number;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly user: Repository<User>,
    @InjectRepository(Tag) private readonly tag: Repository<Tag>,
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
      relations: ['tags'],
      where: {
        // 模糊查询
        name: Like(`%${query.keyWord}%`),
      },
      order: {
        id: 'DESC',
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

  async addTags(params: ITagParams) {
    const userInfo = await this.user.findOne({ where: { id: params.userId } });
    const tagList: Tag[] = [];
    for (const tagName of params.tags) {
      const tagEntity = new Tag();
      tagEntity.name = tagName;
      await this.tag.save(tagEntity);
      tagList.push(tagEntity);
    }
    if (userInfo) {
      userInfo.tags = tagList;
      await this.user.save(userInfo);
    }
    return true;
  }
}
