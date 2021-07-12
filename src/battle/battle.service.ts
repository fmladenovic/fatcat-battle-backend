import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { BattleEntity } from './battle.entity';
import { BattleInGameEntity } from './battleInGame/battle-in-game.entity';
import { BattleInGameService } from './battleInGame/battle-in-game.service';
import { BattleDTO } from './dto/battle.dto';
import { CreateBattleDTO } from './dto/create-battle.dto';

@Injectable()
export class BattleService {
  constructor(
    @InjectRepository(BattleEntity)
    private readonly battleRepository: Repository<BattleEntity>,
    private readonly battleInGameService: BattleInGameService
  ) {}

  public async findOne(
    id: string,
    findOptions?: FindOneOptions<BattleEntity>,
    errorMessage?: HttpException | null
  ) {
    const battle = await this.battleRepository.findOne(id, findOptions);
    if (!battle && errorMessage !== null) {
      throw errorMessage || new NotFoundException('Battle not found');
    }
    return battle;
  }

  public async searchBattles(): Promise<BattleDTO[]> {
    const battles = await this.battleRepository.find({
      relations: ['armies', 'history'],
      loadEagerRelations: true
    });
    return battles.map(BattleService.convertToDto);
  }

  async saveBattle(battle: BattleEntity, errorMessage?: HttpException | null) {
    try {
      await this.battleRepository.save(battle);
    } catch (e) {
      Logger.error(e.message, e.stack, 'BattleService');
      if (errorMessage !== null) {
        throw errorMessage ||
          new InternalServerErrorException('Database error');
      }
    }
  }

  public async createBattle(battleInfo: CreateBattleDTO): Promise<BattleDTO> {
    const battle = this.battleRepository.create(battleInfo);
    await this.saveBattle(battle);
    return BattleService.convertToDto(battle);
  }

  public async startBattle(battleId: string): Promise<BattleInGameEntity> {
    const battle = await this.findOne(battleId, {
      relations: ['armies', 'history'],
      loadEagerRelations: true
    });
    if (!battle) {
      throw new NotFoundException(`Battle with ${battleId} doesn't exist`);
    }
    const battleInGame = await this.battleInGameService.createInGameBattle(
      battle
    );
    return battleInGame;
  }

  public static convertToDto(battleEntry: BattleEntity): BattleDTO {
    return {
      id: battleEntry.id,
      name: battleEntry.name,
      armies: battleEntry.armies || [],
      history: battleEntry.history || []
    };
  }
}
