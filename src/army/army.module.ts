import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BattleModule } from '../battle/battle.module';
import { ArmyController } from './army.controller';
import { ArmyEntity } from './army.entity';
import { ArmyService } from './army.service';

@Module({
  imports: [TypeOrmModule.forFeature([ArmyEntity]), BattleModule],
  controllers: [ArmyController],
  providers: [ArmyService],
  exports: [ArmyService],
})
export class ArmyModule {}
