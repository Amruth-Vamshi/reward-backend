import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
  TableColumn
} from "typeorm";

export class StoreAdmimLevel1578897657453 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: "store_admin_level",
        columns: [
          {
            name: "id",
            type: "varchar",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "uuid"
          },
          {
            name: "name",
            type: "varchar",
            isNullable: false
          },
          {
            name: "code",
            type: "varchar",
            isNullable: false
          },
          {
            name: "parentId",
            type: "varchar(36)",
            isNullable: true
          },
          {
            name: "created_by",
            type: "varchar",
            isNullable: true
          },
          {
            name: "last_modified_by",
            type: "varchar",
            isNullable: true
          },
          {
            name: "created_time",
            type: "datetime(6)",
            default: "CURRENT_TIMESTAMP(6)",
            isNullable: true
          },
          {
            name: "last_modified_time",
            type: "datetime(6)",
            default: "CURRENT_TIMESTAMP(6)",
            isNullable: true
          }
        ]
      })
    );

    await queryRunner.createForeignKey(
      "store_admin_level",
      new TableForeignKey({
        name: "FK_STORE_ADMIN_LEVEL_PARENT_ID",
        columnNames: ["parentId"],
        referencedColumnNames: ["id"],
        referencedTableName: "store_admin_level"
      })
    );

    await queryRunner.createIndex(
      "store_admin_level",
      new TableIndex({
        name: "IDX_STORE_ADMIN_LEVEL_PARENT_ID",
        columnNames: ["parentId"]
      })
    );

    // Closure table
    await queryRunner.createTable(
      new Table({
        name: "store_admin_level_closure",
        columns: [
          {
            name: "id_ancestor",
            type: "varchar",
            isPrimary: true,
            isNullable: false
          },
          {
            name: "id_descendant",
            type: "varchar",
            isPrimary: true,
            isNullable: false
          }
        ]
      })
    );

    await queryRunner.createForeignKey(
      "store_admin_level_closure",
      new TableForeignKey({
        name: "FK_STORE_ADMIN_LEVEL_ANCESTOR_ID",
        columnNames: ["id_ancestor"],
        referencedColumnNames: ["id"],
        referencedTableName: "store_admin_level"
      })
    );

    await queryRunner.createForeignKey(
      "store_admin_level_closure",
      new TableForeignKey({
        name: "FK_STORE_ADMIN_LEVEL_DESCEDANT_ID",
        columnNames: ["id_descendant"],
        referencedColumnNames: ["id"],
        referencedTableName: "store_admin_level"
      })
    );

    await queryRunner.createIndex(
      "store_admin_level_closure",
      new TableIndex({
        name: "IDX_STORE_ADMIN_LEVEL_DESCEDANT_ID",
        columnNames: ["id_descendant"]
      })
    );
    await queryRunner.createIndex(
      "store_admin_level_closure",
      new TableIndex({
        name: "IDX_STORE_ADMIN_LEVEL_ANCESTOR_ID",
        columnNames: ["id_ancestor"]
      })
    );

    // store column
    await queryRunner.addColumn(
      "store",
      new TableColumn({
        type: "varchar(36)",
        name: "store_admin_level_id",
        isNullable: true
      })
    );

    // foriegn key for store
    await queryRunner.createForeignKey(
      "store",
      new TableForeignKey({
        name: "FK_STORE_ADMIN_LEVEL_ID",
        columnNames: ["store_admin_level_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "store_admin_level"
      })
    );
    // index for store
    await queryRunner.createIndex(
      "store",
      new TableIndex({
        name: "IDX_STORE_ADMIN_LEVEL_ID",
        columnNames: ["store_admin_level_id"]
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropForeignKey("store", "FK_STORE_ADMIN_LEVEL_ID");
    await queryRunner.dropForeignKey(
      "store_admin_level_closure",
      "FK_STORE_ADMIN_LEVEL_DESCEDANT_ID"
    );
    await queryRunner.dropForeignKey(
      "store_admin_level_closure",
      "FK_STORE_ADMIN_LEVEL_ANCESTOR_ID"
    );

    await queryRunner.dropIndex("store", "IDX_STORE_ADMIN_LEVEL_ID");
    await queryRunner.dropIndex(
      "store_admin_level_closure",
      "IDX_STORE_ADMIN_LEVEL_ANCESTOR_ID"
    );
    await queryRunner.dropIndex(
      "store_admin_level_closure",
      "IDX_STORE_ADMIN_LEVEL_DESCEDANT_ID"
    );

    await queryRunner.dropForeignKey(
      "store_admin_level",
      "FK_STORE_ADMIN_LEVEL_PARENT_ID"
    );

    await queryRunner.dropIndex(
      "store_admin_level",
      "IDX_STORE_ADMIN_LEVEL_PARENT_ID"
    );

    let storeAdminLevel = await queryRunner.getTable("store_admin_level");
    if (storeAdminLevel) {
      await queryRunner.dropTable("store_admin_level");
    }
    await queryRunner.dropColumn("store", "store_admin_level_id");
  }
}
