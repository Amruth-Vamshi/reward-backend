import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex
} from "typeorm";

export class AddTierTableToDatabase1674805418946 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: "tier",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isNullable: false,
            isGenerated: true,
            generationStrategy: "increment"
          },
          {
            name: "created_by",
            type: "varchar",
            isNullable: false
          },
          {
            name: "last_modified_by",
            type: "varchar",
            isNullable: false
          },
          {
            name: "created_time",
            type: "datetime(6)",
            default: "CURRENT_TIMESTAMP(6)",
            isNullable: false
          },
          {
            name: "last_modified_time",
            type: "datetime(6)",
            default: "CURRENT_TIMESTAMP(6)",
            isNullable: false
          },
          {
            name: "code",
            isNullable: false,
            type: "varchar",
            length: "255"
          },
          {
            name: "description",
            isNullable: true,
            type: "varchar",
            length: "255"
          },
          {
            name: "organization_id",
            isNullable: false,
            type: "varchar",
            length: "36"
          }
        ]
      })
    );

    await queryRunner.createForeignKey(
      "tier",
      new TableForeignKey({
        columnNames: ["organization_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "organization"
      })
    );

    await queryRunner.createIndex(
      "tier",
      new TableIndex({
        name: "UNIQUE_TIER_CODE_FOR_ORG",
        columnNames: ["code", "organization_id"],
        isUnique: true
      })
    );

    /*
     * Making the tier field in customer table null as we were facing an issue when adding the foreign key constraint to it as some of the customers had some dummy data. 
     * We are not updating the existing data in tier field as this might not be needed since we have introduced the tier recently
     * and all tier values before this instance are not validated, hence setting them as null.
     */

    await queryRunner.query(
      `UPDATE customer SET tier = null WHERE tier IS NOT NULL`
    );

    await queryRunner.createForeignKey(
      "customer",
      new TableForeignKey({
        name: "FK_CUSTOMER_TIER",
        columnNames: ["tier"],
        referencedColumnNames: ["code"],
        referencedTableName: "tier"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE customer DROP FOREIGN KEY FK_CUSTOMER_TIER`
    );

    await queryRunner.query(`DROP TABLE tier`);
  }
}
