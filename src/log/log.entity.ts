import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  ManyToOne
} from 'typeorm';
import { BattleInGameEntity } from '../battle/battleInGame/battle-in-game.entity';

@Entity({ name: 'logs' })
export class LogEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  message: string;

  @ManyToOne(() => BattleInGameEntity)
  battleInGame: BattleInGameEntity;

  @CreateDateColumn()
  createdAt: Date;
}
