import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey
} from 'typeorm';

export class logs1626200349782 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'logs',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '40',
            isPrimary: true
          },
          {
            name: 'message',
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
            name: 'created_at',
            type: 'datetime',
            isNullable: false,
            default: 'now()'
          }
        ]
      })
    );

    await queryRunner.createForeignKey(
      'logs',
      new TableForeignKey({
        columnNames: ['battle_in_game_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'battles_in_game',
        onDelete: 'CASCADE'
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const logsTable = await queryRunner.getTable('logs');
    const logsBattlesInGame = logsTable.foreignKeys.find(
      fk => fk.columnNames[0] === 'battle_in_game_id'
    );

    await queryRunner.dropForeignKey('logs', logsBattlesInGame);
    await queryRunner.dropTable('logs');
  }
}
