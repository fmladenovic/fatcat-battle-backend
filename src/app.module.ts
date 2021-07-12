import { Module } from '@nestjs/common';
import { DbModule } from './db/db.module';
import { ConfigModule } from './config/config.module';
import { BattleModule } from './battle/battle.module';
import { ArmyModule } from './army/army.module';

@Module({
  imports: [DbModule, ConfigModule, ArmyModule, BattleModule ],
})
export class AppModule {}
