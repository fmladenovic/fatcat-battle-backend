import { Controller, Get, Param, Query, Post, Body, Delete, UseGuards, HttpCode, Put } from '@nestjs/common';
import { CreateArmyDTO } from '../army/dto/create-army.dto';
import { BattleService } from './battle.service';
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

}
