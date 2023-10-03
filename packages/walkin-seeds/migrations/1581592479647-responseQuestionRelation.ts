// import {
//   MigrationInterface,
//   QueryRunner,
//   TableColumn,
//   TableForeignKey,
//   Table,
//   TableIndex
// } from "typeorm";
// import { Choice, Response } from "@walkinserver/walkin-refinex/src/entity";

// export class responseQuestionRelation1581592479647
//   implements MigrationInterface {
//   public async up(queryRunner: QueryRunner): Promise<any> {
//     await queryRunner.addColumn(
//       "response",
//       new TableColumn({
//         name: "questionId",
//         type: "int",
//         isNullable: true
//       })
//     );
//     await queryRunner.createForeignKey(
//       "response",
//       new TableForeignKey({
//         columnNames: ["questionId"],
//         referencedColumnNames: ["id"],
//         referencedTableName: "question",
//         name: "RESPONSE_QUESTION_FK"
//       })
//     );
//     await queryRunner.createTable(
//       new Table({
//         name: "response_choices_choice",
//         columns: [
//           {
//             name: "responseId",
//             type: "int"
//           },
//           {
//             name: "choiceId",
//             type: "int"
//           }
//         ],
//         foreignKeys: [
//           {
//             columnNames: ["responseId"],
//             referencedColumnNames: ["id"],
//             referencedTableName: "response",
//             name: "FK_RESPONSEID_ID",
//             onDelete: "cascade"
//           },
//           {
//             columnNames: ["choiceId"],
//             referencedColumnNames: ["id"],
//             referencedTableName: "choice",
//             name: "FK_CHOICEID_ID",
//             onDelete: "cascade"
//           }
//         ]
//       })
//     );
//     const responses: Array<any> = await queryRunner.manager
//       .createQueryBuilder("response", "response")
//       .getMany();

//     for (const response of responses) {
//       const responseObj = await queryRunner.manager.findOne(
//         Response,
//         response.id
//       );
//       const choice = await queryRunner.manager.findOne(
//         Choice,
//         response.choiceSelectedId
//       );
//       responseObj.choicesSelected = [choice];
//       await queryRunner.manager.save(responseObj);
//     }
//     const responseTable = await queryRunner.getTable("response");
//     for (const foreignKey of responseTable.foreignKeys) {
//       console.log(foreignKey);

//       const found = foreignKey.columnNames.find(
//         columnName => columnName === "choiceSelectedId"
//       );

//       if (found) {
//         await queryRunner.dropForeignKey("response", foreignKey);
//       }
//     }
//     await queryRunner.dropColumn("response", "choiceSelectedId");
//   }

//   public async down(queryRunner: QueryRunner): Promise<any> {
//     await queryRunner.dropForeignKey("response", "RESPONSE_QUESTION_FK");
//     await queryRunner.dropColumn("response", "questionId");
//     await queryRunner.dropTable("response_choices_choice", true, true);
//     await queryRunner.addColumn(
//       "response",
//       new TableColumn({
//         name: "choiceSelectedId",
//         type: "int",
//         isNullable: true
//       })
//     );
//     await queryRunner.createForeignKey(
//       "response",
//       new TableForeignKey({
//         columnNames: ["choiceSelectedId"],
//         referencedColumnNames: ["id"],
//         referencedTableName: "choice",
//         name: "FK_CHOICE_RESPONSE_ID"
//       })
//     );
//   }
// }
