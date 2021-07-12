import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BattleInGameService } from './battle-in-game.service';
import { BattleInGameEntity } from './battle-in-game.entity';
import { ArmyInGameModule } from '../../army/armyInGame/army-in-game.module';

@Module({
  imports: [TypeOrmModule.forFeature([BattleInGameEntity]), ArmyInGameModule],
  providers: [BattleInGameService],
  exports: [BattleInGameService]
})
export class BattleInGameModule {}
