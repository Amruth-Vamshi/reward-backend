import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

// tslint:disable-next-line:class-name
export class offerifx1566908751875 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropIndex("offer", "IDX_93f350ef80008e9c1aad98cbf6");
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // tslint:disable-next-line:no-console
    console.log("Do nothing");
  }
}
