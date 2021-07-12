import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  ManyToOne
} from 'typeorm';
import { BattleInGameEntity } from '../../battle/battleInGame/battle-in-game.entity';
import { ArmyEntity } from '../army.entity';

export const attackStrategy = {
  RANDOM: 'RANDOM',
  STRONGES: 'STRONGES',
  WEAKEST: 'WEAKEST'
};

export const status = {
  ACTIVE: 'ACTIVE',
  DONE: 'DONE'
};

@Entity({ name: 'armies_in_game' })
export class ArmyInGameEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  currentUnits: number;

  @Column()
  currentLoadingTime: number;

  @ManyToOne(() => ArmyEntity)
  army: ArmyEntity;

  @ManyToOne(() => BattleInGameEntity)
  battleInGame: BattleInGameEntity;

  @Column()
  status: 'ACTIVE' | 'DONE';

  @CreateDateColumn()
  createdAt: Date;
}
