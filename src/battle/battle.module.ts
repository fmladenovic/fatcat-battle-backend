import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArmyModule } from '../army/army.module';
import { BattleController } from './battle.controller';
import { BattleEntity } from './battle.entity';
import { BattleService } from './battle.service';

@Module({
  imports: [TypeOrmModule.forFeature([BattleEntity])],
  controllers: [BattleController],
  providers: [BattleService],
  exports: [BattleService],
})
export class BattleModule {}
