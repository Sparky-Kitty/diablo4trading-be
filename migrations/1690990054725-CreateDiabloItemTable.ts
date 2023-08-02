import { MigrationInterface, QueryRunner, Table, TableColumn, TableColumnOptions, TableForeignKey } from 'typeorm';

export class CreateDiabloItemTable1690990054725 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'diabloItem',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'uuid',
            type: 'uuid',
            isNullable: false,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'power',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'powerType',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'type',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'dps',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'armor',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'socketCount',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'seasonalAffix',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'requiredLevel',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'classRequirement',
            type: 'varchar',
            isNullable: true,
          },
          ...Array.from({ length: 6 }, (_, index) => {
            const affixIdKey = `${index < 2 ? 'inherentA' : 'a'}ffix${index < 2 ? index : index - 2}Id`;
            const affixValueKey = `${index < 2 ? 'inherentA' : 'a'}ffix${index < 2 ? index : index - 2}Value`;

            const columns: TableColumnOptions[] = [
              {
                name: affixIdKey,
                type: 'integer',
                isNullable: true,
              },
              {
                name: affixValueKey,
                type: 'decimal',
                precision: 6,
                scale: 2,
                isNullable: true,
              }
            ];

            return columns;
          }).flat(),
          {
            name: 'createdDate',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'deleted',
            type: 'boolean',
            default: false,
          }
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('diabloItem');
  }
}
