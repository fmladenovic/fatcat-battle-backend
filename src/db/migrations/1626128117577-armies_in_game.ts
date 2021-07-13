import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey
} from 'typeorm';

export class armiesInGame1626128117577 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'armies_in_game',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '40',
            isPrimary: true
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false
          },
          {
            name: 'current_units',
            type: 'integer',
            isNullable: false
          },
          {
            name: 'current_loading_time',
            type: 'integer',
            isNullable: false
          },
          {
            name: 'attack_strategy',
            type: 'varchar',
            isNullable: false
          },
          {
            name: 'battle_in_game_id',
            type: 'varchar',
            length: '36',
            isNullable: false
          },
          {
            name: 'status',
            type: 'varchar',
            isNullable: false
          },
          {
            name: 'created_at',
            type: 'datetime',
            isNullable: false,
            default: 'now()'
          }
        ]
      })
    );

    await queryRunner.createForeignKey(
      'armies_in_game',
      new TableForeignKey({
        columnNames: ['battle_in_game_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'battles_in_game',
        onDelete: 'CASCADE'
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const armiesInGameTable = await queryRunner.getTable('armies_in_game');
    const armiesInGameBattleInGame = armiesInGameTable.foreignKeys.find(
      fk => fk.columnNames[0] === 'battle_in_game_id'
    );

    await queryRunner.dropForeignKey(
      'armies_in_game',
      armiesInGameBattleInGame
    );
    await queryRunner.dropTable('armies_in_game');
  }
}
