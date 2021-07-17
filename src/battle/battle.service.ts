import {
  CACHE_MANAGER,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { FindOneOptions, Repository } from 'typeorm';
import { GameService } from '../game/game.service';
import { BattleEntity } from './battle.entity';
import { BattleInGameEntity } from './battleInGame/battle-in-game.entity';
import { BattleInGameService } from './battleInGame/battle-in-game.service';
import { BattleDTO } from './dto/battle.dto';
import { CreateBattleDTO } from './dto/create-battle.dto';

@Injectable()
export class BattleService {
  battles: { [key: string]: BattleEntity } = {};
  constructor(
    @InjectRepository(BattleEntity)
    private readonly battleRepository: Repository<BattleEntity>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly battleInGameService: BattleInGameService,
    private readonly gameService: GameService
  ) {}

  public async cacheExistingBattles() {
    const battles = await this.battleRepository.find({
      relations: ['armies', 'history'],
      loadEagerRelations: true
    });

    this.battles = battles.reduce((prev, curr) => {
      prev[curr.id] = { ...curr };
      return { ...prev };
    }, {});
    // const test = await Promise.all(
    //   battles.map(battle =>
    //     this.cacheManager.set<BattleEntity>(battle.id, battle, { ttl: 0 })
    //   )
    // );
  }

  public async cacheBattle(battle: BattleEntity) {
    await this.cacheManager.set(battle.id, battle, { ttl: 0 });
  }

  public async findOne(
    id: string,
    findOptions?: FindOneOptions<BattleEntity>,
    errorMessage?: HttpException | null
  ) {
    const battle = await this.battleRepository.findOne(id, findOptions);
    if (!battle && errorMessage !== null) {
      throw errorMessage || new NotFoundException('Battle not found');
    }
    return battle;
  }

  public async searchBattles(): Promise<BattleDTO[]> {
    const battles = await this.battleRepository.find({
      relations: ['armies', 'history'],
      loadEagerRelations: true
    });
    return battles.map(BattleService.convertToDto);
  }

  async saveBattle(battle: BattleEntity, errorMessage?: HttpException | null) {
    try {
      await this.battleRepository.save(battle);
    } catch (e) {
      Logger.error(e.message, e.stack, 'BattleService');
      if (errorMessage !== null) {
        throw errorMessage ||
          new InternalServerErrorException('Database error');
      }
    }
  }

  public async createBattle(battleInfo: CreateBattleDTO): Promise<BattleDTO> {
    const battle = this.battleRepository.create(battleInfo);
    await this.saveBattle(battle);
    this.battles[battle.id] = battle;
    return BattleService.convertToDto(battle);
  }

  public async startBattle(battleId: string): Promise<BattleInGameEntity> {
    // const battle = await this.cacheManager.get<BattleEntity>(battleId);
    const battle = this.battles[battleId];
    if (!battle) {
      throw new NotFoundException(`Battle with ${battleId} doesn't exist`);
    }
    const battleInGame = this.battleInGameService.createInGameBattle(battle);
    this.gameService.play(battleInGame);
    return battleInGame;
  }

  public static convertToDto(battleEntry: BattleEntity): BattleDTO {
    return {
      id: battleEntry.id,
      name: battleEntry.name,
      armies: battleEntry.armies || [],
      history: battleEntry.history
        ? battleEntry.history.sort(
            (a: BattleInGameEntity, b: BattleInGameEntity) =>
              b.createdAt.getTime() - a.createdAt.getTime()
          )
        : []
    };
  }
}
