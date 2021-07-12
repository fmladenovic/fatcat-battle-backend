import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  OneToMany
} from 'typeorm';
import { ArmyEntity } from '../army/army.entity';
import { BattleInGameEntity } from './battleInGame/battle-in-game.entity';

@Entity({ name: 'battles' })
export class BattleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @OneToMany(
    () => ArmyEntity,
    army => army.battle
  )
  armies: ArmyEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(
    () => BattleInGameEntity,
    battleInGame => battleInGame.battle
  )
  history: BattleInGameEntity[];
}
