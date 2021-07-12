import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BattleService } from '../battle/battle.service';
import { ArmyEntity } from './army.entity';
import { ArmyDTO } from './dto/army.dto';
import { CreateArmyDTO } from './dto/create-army.dto';

@Injectable()
export class ArmyService {
  constructor(
    @InjectRepository(ArmyEntity)
    private readonly armyRepository: Repository<ArmyEntity>,
    private readonly battleService: BattleService
  ) {}

  async saveArmy(army: ArmyEntity, errorMessage?: HttpException | null) {
    try {
      await this.armyRepository.save(army);
    } catch (e) {
      Logger.error(e.message, e.stack, 'ArmyService');
      if (errorMessage !== null) {
        throw errorMessage ||
          new InternalServerErrorException('Database error');
      }
    }
  }

  public async createArmy(
    battleId: string,
    armyInfo: CreateArmyDTO
  ): Promise<ArmyDTO> {
    const battle = await this.battleService.findOne(battleId);
    if (!battle) {
      throw new NotFoundException(`Battle with id: ${battle} doesn't exist!`);
    }
    const army = this.armyRepository.create({
      ...armyInfo,
      battle: { id: battleId }
    });
    console.log(army);
    await this.saveArmy(army);
    return ArmyService.convertToDto(army);
  }

  public static convertToDto(armyEntry: ArmyEntity): ArmyDTO {
    return {
      id: armyEntry.id,
      name: armyEntry.name,
      units: armyEntry.units,
      attackStrategy: armyEntry.attackStrategy,
      battleId: armyEntry.battle.id
    };
  }
}
