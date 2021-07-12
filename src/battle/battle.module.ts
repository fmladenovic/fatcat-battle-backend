import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BattleController } from './battle.controller';
import { BattleEntity } from './battle.entity';
import { BattleService } from './battle.service';
import { BattleInGameModule } from './battleInGame/battle-in-game.module';

@Module({
  imports: [TypeOrmModule.forFeature([BattleEntity]), BattleInGameModule],
  controllers: [BattleController],
  providers: [BattleService],
  exports: [BattleService]
})
export class BattleModule {}
