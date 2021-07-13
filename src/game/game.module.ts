import { Module } from '@nestjs/common';
import { ArmyInGameModule } from '../army/armyInGame/army-in-game.module';
import { BattleInGameModule } from '../battle/battleInGame/battle-in-game.module';
import { GameService } from './game.service';

@Module({
  imports: [ArmyInGameModule, BattleInGameModule], // LogModule
  providers: [GameService],
  exports: [GameService]
})
export class GameModule {}
