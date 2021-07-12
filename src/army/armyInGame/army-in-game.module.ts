import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArmyInGameEntity } from './army-in-game.entity';
import { ArmyInGameService } from './army-in-game.service';

@Module({
  imports: [TypeOrmModule.forFeature([ArmyInGameEntity])],
  providers: [ArmyInGameService],
  exports: [ArmyInGameService]
})
export class ArmyInGameModule {}
