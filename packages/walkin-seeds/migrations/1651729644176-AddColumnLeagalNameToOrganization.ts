import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";
import { Organization } from "@walkinserver/walkin-core/src/entity";

export class AddColumnLeagalNameToOrganization1651729644176 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn(
          "organization",
          new TableColumn({
            name: "brand_logo",
            type: "varchar(256)",
            isNullable: true,
          })
        );
        await queryRunner.addColumn(
          "organization",
          new TableColumn({
            name: "legal_name",
            type: "varchar(256)",
            isNullable: true,
          })
        );
        await queryRunner.connection.transaction(async (transactionManager) => {
          const organizations = await transactionManager.find(Organization, {
            cache: false,
          });
          for (const organization of organizations) {
            organization.legalName = organization.name;
            await transactionManager.save(organization);
          }
        });
      }
    
      public async down(queryRunner: QueryRunner): Promise<any> {
        // do nothing
      }

}
