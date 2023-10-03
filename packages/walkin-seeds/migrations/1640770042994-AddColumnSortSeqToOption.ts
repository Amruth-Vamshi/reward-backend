import { MigrationInterface, QueryRunner, TableColumn, TableIndex } from "typeorm";

export class AddColumnSortSeqToOption1640765243976 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn(
            "option",
            new TableColumn({
                name: "sortSeq",
                isNullable: true,
                type: "int",
                default: 0
            })
        );
        await queryRunner.createIndex(
            "option",
            new TableIndex({
                columnNames: ["sortSeq"],
                name: "INDEX_FOR_SORTSEQ_OPTION"
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        // do nothing
    }
}
