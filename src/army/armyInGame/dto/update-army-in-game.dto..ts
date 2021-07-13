export interface UpdateArmyInGame {
  id: string;
  currentUnits?: number;
  currentLoadingTime?: number;
  status?: 'ACTIVE' | 'DESTROYED' | 'WINNER';
}
