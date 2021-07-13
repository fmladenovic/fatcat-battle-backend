import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BattleEntity } from '../../battle/battle.entity';
import { BattleInGameEntity } from '../../battle/battleInGame/battle-in-game.entity';
import { ArmyInGameEntity } from './army-in-game.entity';
import { UpdateArmyInGame } from './dto/update-army-in-game.dto.';

@Injectable()
export class ArmyInGameService {
  constructor(
    @InjectRepository(ArmyInGameEntity)
    private readonly armyInGameRepository: Repository<ArmyInGameEntity>
  ) {}

  async saveArmyInGame(
    army: ArmyInGameEntity,
    errorMessage?: HttpException | null
  ) {
    try {
      await this.armyInGameRepository.save(army);
    } catch (e) {
      Logger.error(e.message, e.stack, 'ArmyInGameService');
      if (errorMessage !== null) {
        throw errorMessage ||
          new InternalServerErrorException('Database error');
      }
    }
  }

  async saveArmiesInGame(
    armies: ArmyInGameEntity[],
    errorMessage?: HttpException | null
  ) {
    try {
      await this.armyInGameRepository.save(armies);
    } catch (e) {
      Logger.error(e.message, e.stack, 'ArmyInGameService');
      if (errorMessage !== null) {
        throw errorMessage ||
          new InternalServerErrorException('Database error');
      }
    }
  }

  public async createArmiesInGame(
    battle: BattleEntity,
    battleInGame: BattleInGameEntity
  ): Promise<ArmyInGameEntity[]> {
    let armies = undefined;
    const lastBattleState = battle.history.sort(
      (a: BattleInGameEntity, b: BattleInGameEntity) =>
        b.createdAt.getTime() - a.createdAt.getTime()
    )[0];
    if (lastBattleState && lastBattleState.status === 'IN_PROGRESS') {
      armies = [
        ...lastBattleState.armiesInGame.map(army => ({
          name: army.name,
          currentUnits: army.currentUnits,
          currentLoadingTime: army.currentLoadingTime,
          battleInGame: { id: battleInGame.id },
          attackStrategy: army.attackStrategy,
          status: army.status
        }))
      ];
    } else {
      armies = [
        ...battle.armies.map(army => ({
          name: army.name,
          currentUnits: army.units,
          currentLoadingTime: army.units,
          battleInGame: { id: battleInGame.id },
          attackStrategy: army.attackStrategy,
          status: 'ACTIVE'
        }))
      ];
    }

    const armiesInGame = this.armyInGameRepository.create(armies);
    await this.saveArmiesInGame(armiesInGame);
    return armiesInGame;
  }

  public async updateArmyInGame(armyInfo: UpdateArmyInGame) {
    const armyInGame = this.armyInGameRepository.create(armyInfo);
    await this.saveArmyInGame(armyInGame);
  }
}
