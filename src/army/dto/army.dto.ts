export class ArmyDTO {
  id: string;
  name: string;
  units: number;
  attackStrategy: 'RANDOM' | 'STRONGES' | 'WEAKEST';
  battleId: string;
}
