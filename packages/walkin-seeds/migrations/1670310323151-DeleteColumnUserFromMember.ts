import { MigrationInterface, QueryRunner } from "typeorm";

export class DeleteColumnUserFromMember1670310323151 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const member = await queryRunner.getTable("member");
        await queryRunner.dropForeignKey(member, "FK_08897b166dee565859b7fb2fcc8");
        await queryRunner.dropColumn(member, "userId");
        await queryRunner.dropColumn(member, "Role");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
