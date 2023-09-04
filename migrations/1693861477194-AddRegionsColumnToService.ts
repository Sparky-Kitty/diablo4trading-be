import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddRegionsColumnToService1693861477194 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'service',
            new TableColumn({
                name: 'regions',
                type: 'integer',
                default: 1,
                isNullable: false,
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('service', 'regions');
    }

}
