import { Controller, Get, Param, Query, Post, Body, Delete, UseGuards, HttpCode, Put } from '@nestjs/common';
import { ArmyService } from './army.service';
import { ArmyDTO } from './dto/army.dto';
import { CreateArmyDTO } from './dto/create-army.dto';

@Controller('armies')
export class ArmyController {
  constructor(private readonly armyServie: ArmyService) {}

  @Post('/:battleId')
  public createArmy(@Param('battleId') battleId: string, @Body() armyInfo: CreateArmyDTO): Promise<ArmyDTO> {
    return this.armyServie.createArmy(battleId, armyInfo);
  }

}
