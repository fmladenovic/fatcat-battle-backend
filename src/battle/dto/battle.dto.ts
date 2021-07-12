import { ArmyDTO } from '../../army/dto/army.dto';
import { BattleInGameEntity } from '../battleInGame/battle-in-game.entity';

export class BattleDTO {
  id: string;
  name: string;
  armies: ArmyDTO[];
  history: BattleInGameEntity[];
}
