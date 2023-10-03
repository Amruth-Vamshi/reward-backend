import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class EntityExtendFieldChanges1571737471414
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "entity_extend_fields",
      new TableColumn({
        name: "description",
        type: "varchar(1000)",
        isNullable: true,
        default: "'DEFAULT TEXT'"
      })
    );
    await queryRunner.addColumn(
      "entity_extend_fields",
      new TableColumn({
        name: "searchable",
        type: "boolean",
        isNullable: true
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const entityExtendField = await queryRunner.getTable(
      "entity_extend_fields"
    );
    await queryRunner.dropColumn(entityExtendField, "description");
    await queryRunner.dropColumn(entityExtendField, "searchable");
  }
}
