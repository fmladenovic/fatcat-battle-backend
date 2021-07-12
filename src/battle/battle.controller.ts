import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { BattleService } from './battle.service';
import { BattleInGameEntity } from './battleInGame/battle-in-game.entity';
import { BattleDTO } from './dto/battle.dto';
import { CreateBattleDTO } from './dto/create-battle.dto';

@Controller('battles')
export class BattleController {
  constructor(private readonly battleServie: BattleService) {}

  @Get()
  public getBattles(): Promise<BattleDTO[]> {
    return this.battleServie.searchBattles();
  }

  @Post()
  public createBattle(@Body() battleInfo: CreateBattleDTO): Promise<BattleDTO> {
    return this.battleServie.createBattle(battleInfo);
  }

  @Post('/start/:battleId')
  public startBattle(
    @Param('battleId') battleId: string
  ): Promise<BattleInGameEntity> {
    return this.battleServie.startBattle(battleId);
  }
}
