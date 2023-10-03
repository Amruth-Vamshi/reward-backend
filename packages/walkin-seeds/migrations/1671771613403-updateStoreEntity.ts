import { MigrationInterface, QueryRunner } from "typeorm";

export class updateStoreEntity1671771613403 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "ALTER TABLE store MODIFY COLUMN code VARCHAR(255) NOT NULL"
    );
    await queryRunner.query(
      "ALTER TABLE store MODIFY COLUMN externalStoreId VARCHAR(255) NOT NULL"
    );

    const storeTable = await queryRunner.getTable("store");
    const storeOrganizationIdForeignKey = storeTable.foreignKeys.find(
      fk => fk.columnNames.indexOf("organization_id") !== -1
    );

    if (storeOrganizationIdForeignKey) {
      await queryRunner.dropForeignKey("store", storeOrganizationIdForeignKey);
    }

    await queryRunner.query(
      "ALTER TABLE store MODIFY COLUMN organization_id VARCHAR(255) NOT NULL"
    );

    await queryRunner.query(
      "ALTER TABLE store ADD CONSTRAINT `FK_dc44d730d041273b81c5d224ed8` FOREIGN KEY (`organization_id`) REFERENCES `organization` (`id`);"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "ALTER TABLE store MODIFY COLUMN code VARCHAR(255) NULL"
    );
    await queryRunner.query(
      "ALTER TABLE store MODIFY COLUMN externalStoreId VARCHAR(255) NULL"
    );
    await queryRunner.query(
      "ALTER TABLE store MODIFY COLUMN organization_id VARCHAR(255) NULL"
    );
  }
}
