import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class expireAfterNullable1574408044345 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.changeColumn(
      "feedback_form",
      "expireAfter",
      new TableColumn({
        type: "text",
        name: "expireAfter",
        isNullable: true
      })
    );
    await queryRunner.changeColumn(
      "feedback_form",
      "autoCreateCustomer",
      new TableColumn({
        type: "boolean",
        name: "autoCreateCustomer",
        default: true
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // This needs to be nullable and true irrespective
  }
}
