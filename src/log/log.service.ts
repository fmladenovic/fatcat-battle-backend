import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    id: string,
    message: string,
    battleInGameId: string,
    createdAt: Date
  ): Promise<LogEntity> {
    const log = this.logRepository.create({
      id,
      message,
      battleInGame: { id: battleInGameId },
      createdAt
    });
    this.saveLog(log);
    return log;
  }
}
