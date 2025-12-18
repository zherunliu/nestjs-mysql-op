import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Generated,
  OneToMany,
} from 'typeorm';
import { Tag } from './tag.entity';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

export interface IProfile {
  nickname: string;
  bio: string;
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  age: number;
  @Column({ type: 'enum', enum: Gender, default: Gender.FEMALE })
  gender: Gender;
  @Column({
    type: 'varchar',
    length: 255,
    name: 'password',
    nullable: false,
    select: false,
    comment: 'password',
  })
  password: string;
  @Column()
  @Generated('uuid')
  uid: string;
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  // 使用 techs.join(',') 存储
  @Column({ type: 'simple-array', nullable: true })
  techs: string[];

  // 使用 JSON.stringify(p) 存储
  @Column({ type: 'simple-json', nullable: true })
  profile: IProfile;

  @OneToMany(() => Tag, (tag) => tag.user)
  tags: Tag[];
}
