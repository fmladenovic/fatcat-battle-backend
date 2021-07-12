import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  ManyToOne,
  RelationId
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
  DESTROYED: 'DESTROYED',
  WINNER: 'WINNER'
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

  @Column()
  attackStrategy: 'RANDOM' | 'STRONGES' | 'WEAKEST';

  @RelationId((army: ArmyInGameEntity) => army.battleInGame)
  battleInGameId: string;

  @ManyToOne(
    () => BattleInGameEntity,
    battle => battle.armiesInGame,
    { onDelete: 'CASCADE' }
  )
  battleInGame: BattleInGameEntity;

  @Column()
  status: 'ACTIVE' | 'DESTROYED' | 'WINNER';

  @CreateDateColumn()
  createdAt: Date;
}
