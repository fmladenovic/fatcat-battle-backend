import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BattleInGameEntity } from '../battle/battleInGame/battle-in-game.entity';
import { LogEntity } from './log.entity';

@Injectable()
export class LogService {
  constructor(
    @InjectRepository(LogEntity)
    private readonly logRepository: Repository<LogEntity>
  ) {}

  async saveLog(log: LogEntity, errorMessage?: HttpException | null) {
    try {
      await this.logRepository.save(log);
    } catch (e) {
      Logger.error(e.message, e.stack, 'LogService');
      if (errorMessage !== null) {
        throw errorMessage ||
          new InternalServerErrorException('Database error');
      }
    }
  }

  public async createLog(
    message: string,
    battleInGameId: string
  ): Promise<LogEntity> {
    const log = this.logRepository.create({
      message,
      battleInGame: { id: battleInGameId }
    });
    await this.saveLog(log);
    return log;
  }
}
