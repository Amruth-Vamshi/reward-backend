import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class MakeOrganizationIdMandatoryInApplication1571913563304
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.changeColumn(
      "application",
      new TableColumn({
        name: "organizationId",
        type: "varchar(36)"
      }),
      new TableColumn({
        name: "organizationId",
        type: "varchar(36)",
        isNullable: false
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.changeColumn(
      "application",
      new TableColumn({
        name: "organizationId",
        type: "varchar(36)",
        isNullable: false
      }),
      new TableColumn({
        name: "organizationId",
        type: "varchar(36)",
        isNullable: true
      })
    );
  }
}
