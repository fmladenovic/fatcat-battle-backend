export class ArmyDTO {
  id: string;
  name: string;
  units: number;
  attackStrategy: 'RANDOM' | 'STRONGEST' | 'WEAKEST';
  battleId: string;
}
