import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey
} from "typeorm";

export class feedbackCategoryOrganizationFix1581057669228
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable("FeedbackCategoryOrganizationRel", true, true);
    await queryRunner.addColumn(
      "feedback_category",
      new TableColumn({
        name: "organizationId",
        type: "varchar",
        isNullable: true
      })
    );
    await queryRunner.createForeignKey(
      "feedback_category",
      new TableForeignKey({
        name: "FK_FEEDBACK_CATEGORY_ORGANIZATION_ID",
        columnNames: ["organizationId"],
        referencedColumnNames: ["id"],
        referencedTableName: "organization"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn("feedback_category", "organizationId");
    await queryRunner.query(
      "CREATE TABLE `FeedbackCategoryOrganizationRel` (`feedbackCategoryId` int NOT NULL, `organizationId` varchar(36) NOT NULL, INDEX `IDX_de7e665a5b2d0635cc7b56dbdf` (`feedbackCategoryId`), INDEX `IDX_5b9b9e52ab00fb7cbf27965fb1` (`organizationId`), PRIMARY KEY (`feedbackCategoryId`, `organizationId`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "ALTER TABLE `FeedbackCategoryOrganizationRel` ADD CONSTRAINT `FK_de7e665a5b2d0635cc7b56dbdfa` FOREIGN KEY (`feedbackCategoryId`) REFERENCES `feedback_category`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `FeedbackCategoryOrganizationRel` ADD CONSTRAINT `FK_5b9b9e52ab00fb7cbf27965fb11` FOREIGN KEY (`organizationId`) REFERENCES `organization`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION"
    );
  }
}
