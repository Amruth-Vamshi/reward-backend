import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateProductAndCustomerTables1657615969742
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    // for product table cleanup
    await queryRunner.query(
      "ALTER TABLE product DROP COLUMN is_purchased_separately"
    );
    await queryRunner.query("ALTER TABLE product DROP COLUMN listable");
    await queryRunner.query("ALTER TABLE product DROP COLUMN imageUrl");

    await queryRunner.query(
      "ALTER TABLE product MODIFY COLUMN extend JSON NULL"
    );
    await queryRunner.query(
      "ALTER TABLE product ADD categoryCode VARCHAR(255) NULL"
    );

    await queryRunner.query(
      "ALTER TABLE product MODIFY COLUMN sku VARCHAR(255) NULL"
    );
    await queryRunner.query(
      "ALTER TABLE product MODIFY COLUMN name VARCHAR(255) NULL"
    );

    await queryRunner.query(
      "ALTER TABLE product MODIFY COLUMN status VARCHAR(255) NOT NULL"
    );

    const productTable = await queryRunner.getTable("product");
    const productOrganizationIdForeignKey = productTable.foreignKeys.find(
      fk => fk.columnNames.indexOf("organization_id") !== -1
    );

    if (productOrganizationIdForeignKey) {
      await queryRunner.dropForeignKey(
        "product",
        productOrganizationIdForeignKey
      );
    }

    await queryRunner.query(
      "ALTER TABLE product MODIFY COLUMN organization_id VARCHAR(36) NOT NULL"
    );

    await queryRunner.query(
      "ALTER TABLE product ADD CONSTRAINT `FK_856d7e7672c2a22652daf70e1e7` FOREIGN KEY (`organization_id`) REFERENCES `organization` (`id`);"
    );

    await queryRunner.query(
      "ALTER TABLE product MODIFY COLUMN external_product_id VARCHAR(255) NOT NULL"
    );

    //for customer table cleanup
    await queryRunner.query(
      "ALTER TABLE customer DROP FOREIGN KEY FK_44c7c03d57d8cd74bac08500b2a"
    );
    await queryRunner.query("ALTER TABLE customer DROP COLUMN person_id");
    await queryRunner.query("ALTER TABLE customer DROP COLUMN onboard_source");

    await queryRunner.query(
      "ALTER TABLE customer MODIFY COLUMN extend JSON NULL"
    );
    await queryRunner.query(
      "ALTER TABLE customer MODIFY COLUMN externalCustomerId VARCHAR(255) NOT NULL"
    );
    await queryRunner.query(
      "ALTER TABLE customer MODIFY COLUMN phoneNumber VARCHAR(255) NOT NULL"
    );

    const customerTable = await queryRunner.getTable("customer");
    const customerOrganizationIdForeignKey = customerTable.foreignKeys.find(
      fk => fk.columnNames.indexOf("organization_id") !== -1
    );

    if (customerOrganizationIdForeignKey) {
      await queryRunner.dropForeignKey(
        "customer",
        customerOrganizationIdForeignKey
      );
    }

    await queryRunner.query(
      "ALTER TABLE customer MODIFY COLUMN organization_id VARCHAR(36) NOT NULL"
    );

    await queryRunner.query(
      "ALTER TABLE customer ADD CONSTRAINT `FK_f59a476121c4fe9ea136699a95d` FOREIGN KEY (`organization_id`) REFERENCES `organization` (`id`);"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
