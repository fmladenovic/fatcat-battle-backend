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
import { GameService } from '../../game/game.service';
import { BattleEntity } from '../battle.entity';
import { BattleInGameEntity } from './battle-in-game.entity';
import { UpdateBattleInGameDTO } from './dto/update-battle-in-game.dto.';

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

  public async createInGameBattle(
    battle: BattleEntity
  ): Promise<BattleInGameEntity> {
    if (battle.armies.length < 3) {
      throw new BadRequestException(
        'Battle should contains at least three armies.'
      );
    }

    const battleInGame = this.battleInGameRepository.create({
      battle: { id: battle.id },
      // armiesInGame: armies,
      status: 'IN_PROGRESS'
    });

    await this.saveBattleInGame(battleInGame);
    const armiesInGame = await this.armyInGameService.createArmiesInGame(
      battle,
      battleInGame
    );

    const battleInGameWitArmies = this.battleInGameRepository.create({
      ...battleInGame,
      armiesInGame
    });
    await this.saveBattleInGame(battleInGameWitArmies);
    return battleInGameWitArmies;
  }

  public async updateInGameBattle(battleInfo: UpdateBattleInGameDTO) {
    const battleInGame = this.battleInGameRepository.create(battleInfo);
    console.log('OKEJ', battleInGame);
    await this.saveBattleInGame(battleInGame);
  }
}
