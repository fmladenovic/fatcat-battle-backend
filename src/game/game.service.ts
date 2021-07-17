import { Injectable, Logger } from '@nestjs/common';
import { attackStrategy } from '../army/army.entity';
import { ArmyInGameEntity } from '../army/armyInGame/army-in-game.entity';
import { ArmyInGameService } from '../army/armyInGame/army-in-game.service';
import { BattleInGameEntity } from '../battle/battleInGame/battle-in-game.entity';
import { BattleInGameService } from '../battle/battleInGame/battle-in-game.service';
import { LogService } from '../log/log.service';
import { GameGateway } from './game.gateway';
import { v4 as uuid } from 'uuid';
import { LogEntity } from '../log/log.entity';

const LOADING_TIME_PER_UNIT = 10;
const DAMAGE_PER_UNIT = 0.5;
const DAMAGE_LAST_UNIT = 1;

@Injectable()
export class GameService {
  constructor(
    private readonly armyInGameService: ArmyInGameService,
    private readonly battleInGameService: BattleInGameService,
    private readonly logService: LogService,
    private readonly wsService: GameGateway
  ) {}

  private pickTarget(
    armies: ArmyInGameEntity[],
    strategy: 'RANDOM' | 'STRONGES' | 'WEAKEST'
  ) {
    if (strategy === attackStrategy.RANDOM) {
      return armies[Math.floor(Math.random() * armies.length)];
    }
    if (strategy === attackStrategy.STRONGEST) {
      const unitsPerArmy = armies.map(army => army.currentUnits);
      return armies[unitsPerArmy.indexOf(Math.max(...unitsPerArmy))];
    }
    if (strategy === attackStrategy.WEAKEST) {
      const unitsPerArmy = armies.map(army => army.currentUnits);
      return armies[unitsPerArmy.indexOf(Math.min(...unitsPerArmy))];
    }
    return;
  }

  private calculateDamage(attacker: ArmyInGameEntity) {
    const damageCalculated =
      attacker.currentUnits >= Math.floor(Math.random() * 100)
        ? attacker.currentUnits * DAMAGE_PER_UNIT
        : 0;
    if (attacker.currentUnits === 1) {
      return damageCalculated ? DAMAGE_LAST_UNIT : 0;
    }
    return Math.floor(damageCalculated);
  }

  private doDamage(attacker: ArmyInGameEntity, target: ArmyInGameEntity) {
    let damage = this.calculateDamage(attacker);
    if (!damage) {
      this.saveLog(
        `Army ${attacker.name} (${attacker.id}) miss the target.`,
        target.battleInGame.id
      );
      return;
    }
    this.saveLog(
      `Army ${attacker.name} (${attacker.id}) hits target army ${target.name} (${target.id}) with damage: ${damage}.`,
      target.battleInGame.id
    );
    target.currentUnits = target.currentUnits - damage;
    this.armyInGameService.updateArmyInGame({
      id: target.id,
      currentUnits: target.currentUnits
    });
  }

  private saveLoadingTime(attacker: ArmyInGameEntity) {
    for (let i = 0; i < attacker.currentUnits; i++) {
      setTimeout(() => {
        this.armyInGameService.updateArmyInGame({
          id: attacker.id,
          currentLoadingTime: i
        });
        // console.log('Save for attacker: ', attacker.id, 'Loading time passed: ', i * LOADING_TIME_PER_UNIT);
      }, i * LOADING_TIME_PER_UNIT);
    }
  }
  private attack(attacker: ArmyInGameEntity, armies: ArmyInGameEntity[]) {
    if (attacker.currentUnits <= 0) {
      this.saveLog(
        `Army ${attacker.name} (${attacker.id}) is destroyed.`,
        attacker.battleInGame.id
      );
      this.armyInGameService.updateArmyInGame({
        id: attacker.id,
        status: 'DESTROYED'
      });
      return;
    }
    const restArmies = armies.filter(
      army => army !== attacker && army.currentUnits > 0
    );

    if (restArmies.length === 0) {
      this.saveLog(
        `Winner is: ${attacker.name} (${attacker.id})`,
        attacker.battleInGame.id
      );
      this.armyInGameService.updateArmyInGame({
        id: attacker.id,
        status: 'WINNER'
      });
      this.battleInGameService.updateInGameBattle({
        id: attacker.battleInGame.id,
        status: 'FINISHED'
      });
      this.wsService.finishedBattle(attacker.battleInGame.id, 'FINISHED');
      return;
    }
    const target = this.pickTarget(restArmies, attacker.attackStrategy);
    this.doDamage(attacker, target);

    // reload time based on current units
    setTimeout(
      () => this.attack(attacker, armies),
      attacker.currentUnits * LOADING_TIME_PER_UNIT
    );
    this.saveLoadingTime(attacker);
  }

  public play(battleInGame: BattleInGameEntity) {
    for (let army of battleInGame.armiesInGame) {
      setTimeout(
        () => this.attack(army, battleInGame.armiesInGame),
        army.currentLoadingTime * LOADING_TIME_PER_UNIT
      );
      this.saveLoadingTime(army);
    }
  }

  private async saveLog(message: string, battleInGameId: string) {
    const log = {
      id: uuid(),
      message,
      battleInGameId,
      createdAt: new Date()
    } as LogEntity;
    this.logService.createLog(log.id, message, battleInGameId, log.createdAt);
    this.wsService.createdLog(log);
    Logger.log(new Date(), message);
  }
}
