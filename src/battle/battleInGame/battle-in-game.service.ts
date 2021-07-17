import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArmyInGameService } from '../../army/armyInGame/army-in-game.service';
import { BattleEntity } from '../battle.entity';
import { BattleInGameEntity } from './battle-in-game.entity';
import { UpdateBattleInGameDTO } from './dto/update-battle-in-game.dto.';
import { v4 as uuid } from 'uuid';

@Injectable()
export class BattleInGameService {
  constructor(
    @InjectRepository(BattleInGameEntity)
    private readonly battleInGameRepository: Repository<BattleInGameEntity>,
    private readonly armyInGameService: ArmyInGameService
  ) {}

  async saveBattleInGame(
    battle: BattleInGameEntity,
    errorMessage?: HttpException | null
  ) {
    try {
      await this.battleInGameRepository.save(battle);
    } catch (e) {
      Logger.error(e.message, e.stack, 'BattleInGameService');
      if (errorMessage !== null) {
        throw errorMessage ||
          new InternalServerErrorException('Database error');
      }
    }
  }

  public createInGameBattle(battle: BattleEntity): BattleInGameEntity {
    if (battle.armies.length < 3) {
      throw new BadRequestException(
        'Battle should contains at least three armies.'
      );
    }

    const battleInGame = this.battleInGameRepository.create({
      id: uuid(),
      battle: { id: battle.id },
      // armiesInGame: armies,
      status: 'IN_PROGRESS'
    });
    const armiesInGame = this.armyInGameService.createArmiesInGame(
      battle,
      battleInGame
    );

    const battleInGameWitArmies = this.battleInGameRepository.create({
      ...battleInGame,
      armiesInGame
    });
    this.saveBattleInGame(battleInGameWitArmies);
    return battleInGameWitArmies;
  }

  public async updateInGameBattle(battleInfo: UpdateBattleInGameDTO) {
    const battleInGame = this.battleInGameRepository.create(battleInfo);
    await this.saveBattleInGame(battleInGame);
  }
}
