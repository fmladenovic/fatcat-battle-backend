import {Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, ManyToOne, OneToOne, OneToMany} from 'typeorm';
import { ArmyInGameEntity } from '../../army/armyInGame/army-in-game.entity';
import { LogEntity } from '../../log/log.entity';
import { BattleEntity } from '../battle.entity';

export const status = {
  FINISHED: 'FINISHED',
  IN_PROGRESS: 'IN_PROGRESS'
}

@Entity({ name: 'battles_in_game' })
export class BattleInGameEntity {
  @PrimaryGeneratedColumn('uuid') 
  id: string;

  @ManyToOne(() => BattleEntity)
  battle: BattleEntity;

  @OneToMany(
    () => ArmyInGameEntity,
    (army) => army.battleInGame,
  )
  armiesInGame: ArmyInGameEntity[];

  @Column()
  status: 'FINISHED' | 'IN_PROGRESS';

  @OneToOne(() => ArmyInGameEntity)
  winner: ArmyInGameEntity;

  @OneToMany(
    () => LogEntity,
    (log) => log.battleInGame,
  )
  logs: LogEntity[];

  @CreateDateColumn()
  createdAt: Date;
}
