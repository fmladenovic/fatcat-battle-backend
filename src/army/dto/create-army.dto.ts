import { IsNotEmpty } from 'class-validator';

export class CreateArmyDTO {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  units: number;
  @IsNotEmpty()
  attackStrategy: 'RANDOM' | 'STRONGES' | 'WEAKEST';
}
