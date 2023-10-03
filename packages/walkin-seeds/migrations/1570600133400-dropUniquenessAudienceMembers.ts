import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableColumn
} from "typeorm";

// tslint:disable-next-line:class-name
export class dropUniquenessAudienceMembers1570600133400
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    //First drop FK indexes
    await queryRunner.dropForeignKey(
      "audience_member",
      "FK_0a1751eb55c7a28a104cea18857"
    );
    await queryRunner.dropForeignKey(
      "audience_member",
      "FK_42e3c7f4f5d906dc5f05a3bebf7"
    );

    //Drop the uniqueness indexes
    await queryRunner.dropIndex(
      "audience_member",
      "REL_0a1751eb55c7a28a104cea1885"
    );
    await queryRunner.dropIndex(
      "audience_member",
      "REL_42e3c7f4f5d906dc5f05a3bebf"
    );

    //Create the Forign key indexe again
    await queryRunner.createForeignKey(
      "audience_member",
      new TableForeignKey({
        columnNames: ["customer_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "customer"
      })
    );
    await queryRunner.createForeignKey(
      "audience_member",
      new TableForeignKey({
        columnNames: ["audience_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "audience"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // tslint:disable-next-line:no-console
    console.log("Do nothing");
  }
}
