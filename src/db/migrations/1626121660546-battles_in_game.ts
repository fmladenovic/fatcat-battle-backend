import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey
} from 'typeorm';

export class battlesInGame1626121660546 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'battles_in_game',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '40',
            isPrimary: true
          },
          {
            name: 'created_at',
            type: 'datetime',
            isNullable: false,
            default: 'now()'
          },
          {
            name: 'battle_id',
            type: 'varchar',
            length: '36',
            isNullable: false
          },
          {
            name: 'status',
            type: 'varchar',
            isNullable: false
          }
        ]
      })
    );

    await queryRunner.createForeignKey(
      'battles_in_game',
      new TableForeignKey({
        columnNames: ['battle_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'battles',
        onDelete: 'CASCADE'
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const battlesInGameTable = await queryRunner.getTable('battles_in_game');
    const battlesInGameBattle = battlesInGameTable.foreignKeys.find(
      fk => fk.columnNames[0] === 'battle_id'
    );

    await queryRunner.dropForeignKey('battles_in_game', battlesInGameBattle);
    await queryRunner.dropTable('battles_in_game');
  }
}
