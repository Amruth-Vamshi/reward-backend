import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";
// import { FormTypeEnum } from "@walkinserver/walkin-refinex/src/common/constants";

export class formType1575870591388 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "customer_feedback",
      new TableColumn({
        type: "boolean",
        name: "forTest",
        default: false
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn("customer_feedback", "forTest");
  }
}
