import { Injectable, Logger } from '@nestjs/common';
import { attackStrategy } from '../army/army.entity';
import { ArmyInGameEntity } from '../army/armyInGame/army-in-game.entity';
import { ArmyInGameService } from '../army/armyInGame/army-in-game.service';
import { BattleInGameEntity } from '../battle/battleInGame/battle-in-game.entity';
import { BattleInGameService } from '../battle/battleInGame/battle-in-game.service';

const LOADING_TIME_PER_UNIT = 10;
const DAMAGE_PER_UNIT = 0.5;
const DAMAGE_LAST_UNIT = 1;

@Injectable()
export class GameService {
  constructor(
    private readonly armyInGameService: ArmyInGameService,
    private readonly battleInGameService: BattleInGameService
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
      this.saveLog(`Army ${attacker.name} (${attacker.id}) miss the target.`);
      return;
    }
    this.saveLog(
      `Army ${attacker.name} (${attacker.id}) hits target army ${target.name} (${target.id}) with damage: ${damage}.`
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
  private attack(
    attacker: ArmyInGameEntity,
    armies: ArmyInGameEntity[],
    battleInGameId: string
  ) {
    if (attacker.currentUnits <= 0) {
      this.saveLog(`Army ${attacker.name} (${attacker.id}) is destroyed.`);
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
      this.saveLog(`Winner is: ${attacker.name} (${attacker.id})`);
      this.armyInGameService.updateArmyInGame({
        id: attacker.id,
        status: 'WINNER'
      });
      this.battleInGameService.updateInGameBattle({
        id: battleInGameId,
        status: 'FINISHED'
      });
      return;
    }
    const target = this.pickTarget(restArmies, attacker.attackStrategy);
    this.doDamage(attacker, target);

    // reload time based on current currentUnits
    setTimeout(
      () => this.attack(attacker, armies, battleInGameId),
      attacker.currentUnits * LOADING_TIME_PER_UNIT
    );
    this.saveLoadingTime(attacker);
  }

  public play(battleInGame: BattleInGameEntity) {
    for (let army of battleInGame.armiesInGame) {
      setTimeout(
        () => this.attack(army, battleInGame.armiesInGame, battleInGame.id),
        army.currentLoadingTime * LOADING_TIME_PER_UNIT
      );
    }
  }

  // gameId
  private saveLog(message: string) {
    const now = new Date(); // format this
    Logger.log(now, message);
    // save log
  }
}
