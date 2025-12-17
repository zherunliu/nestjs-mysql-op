import { Injectable } from '@nestjs/common';
import { CreateManagerDto, transferMoneyDto } from './dto/create-manager.dto';
import { UpdateManagerDto } from './dto/update-manager.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Manager } from './entities/manager.entity';
import { Repository, EntityManager } from 'typeorm';

@Injectable()
export class ManagerService {
  constructor(
    @InjectRepository(Manager) private readonly manager: Repository<Manager>,
    private readonly entityManager: EntityManager,
  ) {}
  create(createManagerDto: CreateManagerDto) {
    return this.manager.save(createManagerDto);
  }

  transferMoney(transferMoneyDto: transferMoneyDto) {
    try {
      // 或者使用 this.manager.manager(EntityManager)
      return this.entityManager.transaction(async (managerTransaction) => {
        const fromAccount = await this.manager.findOneBy({
          id: transferMoneyDto.fromId,
        });
        const toAccount = await this.manager.findOneBy({
          id: transferMoneyDto.toId,
        });
        if (!fromAccount) {
          return { message: 'the sender user does not exist' };
        }
        if (!toAccount) {
          return { message: 'the receiver user does not exist' };
        }
        if (fromAccount.account >= transferMoneyDto.money) {
          await managerTransaction.save(Manager, {
            id: transferMoneyDto.fromId,
            account: fromAccount.account - transferMoneyDto.money,
          });
          await managerTransaction.save(Manager, {
            id: transferMoneyDto.toId,
            account: toAccount.account + transferMoneyDto.money,
          });
          return { message: 'the transfer was successful' };
        } else {
          return { message: 'the balance is insufficient' };
        }
      });
    } catch (err) {
      if (err instanceof Error) throw new Error(err.message);
      else throw new Error(String(err));
    }
  }

  findAll() {
    return this.manager.find();
  }

  findOne(id: number) {
    return this.manager.findOneBy({ id: id });
  }

  update(id: number, updateManagerDto: UpdateManagerDto) {
    return this.manager.update(id, updateManagerDto);
  }

  remove(id: number) {
    return this.manager.delete(id);
  }
}
