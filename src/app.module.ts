import { Module } from '@nestjs/common';
import { DbModule } from './db/db.module';
import { ConfigModule } from './config/config.module';
import { BattleModule } from './battle/battle.module';
import { ArmyModule } from './army/army.module';
import { ArmyInGameModule } from './army/armyInGame/army-in-game.module';
import { BattleInGameModule } from './battle/battleInGame/battle-in-game.module';

@Module({
  imports: [
    DbModule,
    ConfigModule,
    ArmyModule,
    BattleModule,
    BattleInGameModule,
    ArmyInGameModule
  ]
})
export class AppModule {}
