import { ArmyDTO } from "../../army/dto/army.dto";

export class BattleDTO {
  id: string;
  name: string;
  armies: ArmyDTO[];
}
