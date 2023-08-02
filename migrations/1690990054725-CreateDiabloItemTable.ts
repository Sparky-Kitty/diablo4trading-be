import { MigrationInterface, QueryRunner, Table, TableColumn, TableColumnOptions, TableForeignKey } from 'typeorm';

export class CreateDiabloItemTable1690990054725 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'diabloItem',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'uuid',
            type: 'uuid',
            isNullable: false,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()', // If using PostgreSQL, this line generates UUIDs by default
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'power',
            type: 'int',
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
            type: 'int',
            isNullable: true,
          },
          {
            name: 'armor',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'socketCount',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'seasonalAffix',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'requiredLevel',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'classRequirement',
            type: 'varchar',
            isNullable: true,
          },
          ...Array.from({ length: 8 }, (_, index) => {
            const affixId = `affix${index}Id`;
            const affixAttribute0Value = `affix${index}Attribute0Value`;
            const affixAttribute1Value = `affix${index}Attribute1Value`;
            const affixAttribute2Value = `affix${index}Attribute2Value`;

            const columns: TableColumnOptions[] = [
              {
                name: affixId,
                type: 'int',
                isNullable: true,
              },
              {
                name: affixAttribute0Value,
                type: 'decimal',
                precision: 6,
                scale: 2,
                isNullable: true,
              },
              {
                name: affixAttribute1Value,
                type: 'decimal',
                precision: 6,
                scale: 2,
                isNullable: true,
              },
              {
                name: affixAttribute2Value,
                type: 'decimal',
                precision: 6,
                scale: 2,
                isNullable: true,
              },
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
