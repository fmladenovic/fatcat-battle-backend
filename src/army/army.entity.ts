import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  ManyToOne,
  RelationId
} from 'typeorm';
import { BattleEntity } from '../battle/battle.entity';

export const attackStrategy = {
  RANDOM: 'RANDOM',
  STRONGEST: 'STRONGEST',
  WEAKEST: 'WEAKEST'
};

@Entity({ name: 'armies' })
export class ArmyEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  units: number;

  @Column()
  attackStrategy: 'RANDOM' | 'STRONGEST' | 'WEAKEST';

  @RelationId((army: ArmyEntity) => army.battle)
  battleId: string;

  @ManyToOne(
    () => BattleEntity,
    battle => battle.armies,
    { onDelete: 'CASCADE' }
  )
  battle: BattleEntity;

  @CreateDateColumn()
  createdAt: Date;
}
