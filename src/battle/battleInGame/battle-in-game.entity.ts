import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  ManyToOne,
  OneToOne,
  OneToMany,
  RelationId,
  JoinColumn,
  JoinTable
} from 'typeorm';
import { ArmyInGameEntity } from '../../army/armyInGame/army-in-game.entity';
import { LogEntity } from '../../log/log.entity';
import { BattleEntity } from '../battle.entity';

export const status = {
  FINISHED: 'FINISHED',
  IN_PROGRESS: 'IN_PROGRESS'
};

@Entity({ name: 'battles_in_game' })
export class BattleInGameEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @RelationId((battleInGame: BattleInGameEntity) => battleInGame.battle)
  battleId: string;

  @ManyToOne(
    () => BattleEntity,
    battle => battle.history,
    { onDelete: 'CASCADE' }
  )
  battle: BattleEntity;

  @OneToMany(
    () => ArmyInGameEntity,
    army => army.battleInGame,
    {
      eager: true
    }
  )
  armiesInGame: ArmyInGameEntity[];

  @Column()
  status: 'FINISHED' | 'IN_PROGRESS';

  @OneToMany(
    () => LogEntity,
    log => log.battleInGame,
    {
      eager: true
    }
  )
  logs: LogEntity[];

  @CreateDateColumn()
  createdAt: Date;
}
