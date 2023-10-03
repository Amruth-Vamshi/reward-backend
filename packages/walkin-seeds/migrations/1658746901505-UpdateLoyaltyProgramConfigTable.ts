import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export class UpdateLoyaltyProgramConfigTable1658746901505
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "ALTER TABLE loyalty_program_detail DROP FOREIGN KEY FK_c62a23b38789c6352abdc3c72dd"
    );
    await queryRunner.query(
      "ALTER TABLE loyalty_program_config MODIFY COLUMN id INT auto_increment"
    );
    await queryRunner.query(
      "ALTER TABLE loyalty_program_detail MODIFY COLUMN id INT auto_increment"
    );

    await queryRunner.createForeignKey(
      "loyalty_program_detail",
      new TableForeignKey({
        columnNames: ["loyalty_program_config_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "loyalty_program_config"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
