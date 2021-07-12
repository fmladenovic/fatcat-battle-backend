import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  OneToMany
} from 'typeorm';
import { ArmyEntity } from '../army/army.entity';

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
}
