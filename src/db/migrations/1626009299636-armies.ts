import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

// foreign key?
export class armies1626009299636 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'armies',
                columns: [
                    {
                        name: 'id',
                        type: 'varchar',
                        length: '36',
                        isPrimary: true,
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'units',
                        type: 'integer',
                        isNullable: false,
                    },
                    {
                        name: 'attack_strategy',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'battle_id',
                        type: 'varchar',
                        length: '36',
                        isNullable: false,
                    },
                    {
                        name: 'created_at',
                        type: 'datetime',
                        isNullable: false,
                        default: 'now()',
                    },
                ],
            }),
        );

        await queryRunner.createForeignKey(
            'armies',
            new TableForeignKey({
                columnNames: ['battle_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'battles',
                onDelete: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const armiesTable = await queryRunner.getTable('armies');
        const armiesBattle = armiesTable.foreignKeys.find((fk) => fk.columnNames[0] === 'battle');

        await queryRunner.dropForeignKey('armies', armiesBattle);
        await queryRunner.dropTable('armies');
    }

}
