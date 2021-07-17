import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArmyInGameModule } from '../army/armyInGame/army-in-game.module';
import { GameModule } from '../game/game.module';
import { BattleController } from './battle.controller';
import { BattleEntity } from './battle.entity';
import { BattleService } from './battle.service';
import { BattleInGameModule } from './battleInGame/battle-in-game.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BattleEntity]),
    CacheModule.register(),
    BattleInGameModule,
    ArmyInGameModule,
    GameModule
  ],
  controllers: [BattleController],
  providers: [BattleService],
  exports: [BattleService]
})
export class BattleModule {}
