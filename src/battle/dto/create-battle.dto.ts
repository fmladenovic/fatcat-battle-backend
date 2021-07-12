import { IsNotEmpty } from 'class-validator';

export class CreateBattleDTO {
  @IsNotEmpty()
  name: string;
}
