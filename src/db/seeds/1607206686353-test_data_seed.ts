import { MigrationInterface, QueryRunner } from 'typeorm';
import { ArmyEntity } from '../../army/army.entity';
import { BattleEntity } from '../../battle/battle.entity';

export class testDataSeed1607206686353 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const battleRepository = queryRunner.manager.getRepository(BattleEntity);
    const armyRepository = queryRunner.manager.getRepository(ArmyEntity);

    const battles = [
      {
        id: 'bb12b4aa-01d6-433a-ac6e-927ee775af57',
        name: 'Battle 1'
      },
      {
        id: '2e9d043b-0029-486a-825d-9f468e1c225e',
        name: 'Battle 2'
      }
    ];

    const preparedBattles = battleRepository.create([...battles]);
    await battleRepository.save(preparedBattles);

    const armies = [
      {
        id: 'ef0e231b-c7e1-4493-bc5c-325e63fca64c',
        name: 'Army 1',
        units: 80,
        attackStrategy: 'STRONGEST' as 'RANDOM' | 'STRONGEST' | 'WEAKEST',
        battle: { id: battles[0].id }
      },
      {
        id: '30d581a7-f6c5-4468-bdcc-2b80c1c339bf',
        name: 'Army 2',
        units: 90,
        attackStrategy: 'RANDOM' as 'RANDOM' | 'STRONGEST' | 'WEAKEST',
        battle: { id: battles[0].id }
      },
      {
        id: '990229da-f170-48d3-98bd-899b58c3c39b',
        name: 'Army 3',
        units: 100,
        attackStrategy: 'RANDOM' as 'RANDOM' | 'STRONGEST' | 'WEAKEST',
        battle: { id: battles[0].id }
      },
      {
        id: 'd02d6842-4166-4622-8621-f711daf972adb',
        name: 'Army 1',
        units: 80,
        attackStrategy: 'STRONGEST' as 'RANDOM' | 'STRONGEST' | 'WEAKEST',
        battle: { id: battles[1].id }
      },
      {
        id: '1d3556f1-3d0e-4703-938f-589f18e36e96',
        name: 'Army 2',
        units: 95,
        attackStrategy: 'RANDOM' as 'RANDOM' | 'STRONGEST' | 'WEAKEST',
        battle: { id: battles[1].id }
      },
      {
        id: '62423c15-15f0-4f4c-bec6-adc519025447',
        name: 'Army 3',
        units: 88,
        attackStrategy: 'RANDOM' as 'RANDOM' | 'STRONGEST' | 'WEAKEST',
        battle: { id: battles[1].id }
      },
      {
        id: '2e9d043b-0029-486a-825d-9f468e1c225e',
        name: 'Army 4',
        units: 100,
        attackStrategy: 'WEAKEST' as 'RANDOM' | 'STRONGEST' | 'WEAKEST',
        battle: { id: battles[1].id }
      }
    ];
    const preparedArmies = armyRepository.create(armies);
    await armyRepository.save(preparedArmies);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const battleRepository = queryRunner.manager.getRepository(BattleEntity);
    const armyRepository = queryRunner.manager.getRepository(ArmyEntity);

    const armyIds = [
      'ef0e231b-c7e1-4493-bc5c-325e63fca64c',
      '30d581a7-f6c5-4468-bdcc-2b80c1c339bf',
      '990229da-f170-48d3-98bd-899b58c3c39b',
      'd02d6842-4166-4622-8621-f711daf972adb',
      '1d3556f1-3d0e-4703-938f-589f18e36e96',
      '62423c15-15f0-4f4c-bec6-adc519025447',
      '2e9d043b-0029-486a-825d-9f468e1c225e'
    ];
    const battleIds = [
      'bb12b4aa-01d6-433a-ac6e-927ee775af57',
      '2e9d043b-0029-486a-825d-9f468e1c225e'
    ];

    await armyRepository.delete(armyIds);
    await battleRepository.delete(battleIds);
  }
}
