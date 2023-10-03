import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";
import { Customer } from "../../walkin-core/src/entity";
import moment from "moment";

export class ModifyDOBinCustomerTable1668004426855 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const customerDOBMap = {};
        const regex = /^([0]?[1-9]|[1|2][0-9]|[3][0|1])[./-]([0]?[1-9]|[1][0-2])[./-]([0-9]{4}|[0-9]{2})$/; // DD-MM-YYYY
        let customers = [];
        await queryRunner.connection.transaction(async transactionManager => {
            customers = await transactionManager.find(Customer, {
                cache: false
            })

            for (const customer of customers) {
                if (customer.dateOfBirth) {
                    if (customer.dateOfBirth) {
                        let dateOfBirth = customer.dateOfBirth;
                        if (dateOfBirth.match(regex)) { // 31.03.1981
                            dateOfBirth = dateOfBirth.replace(/\./g, "-"); // 31-03-1981
                            dateOfBirth = dateOfBirth.split("-").reverse().join("-"); // 1981-03-31
                        } else {
                            dateOfBirth = moment(dateOfBirth).format("YYYY-MM-DD");
                        }
                        customerDOBMap[customer.id] = dateOfBirth;
                    }
                }
            }
        });

        await queryRunner.changeColumn(
            "customer",
            "dateOfBirth",
            new TableColumn({
                name: "dateOfBirth",
                isNullable: true,
                type: "Date"
            })
        );

        await queryRunner.connection.transaction(async transactionManager => {
            for (const customer of customers) {
                if (customer.dateOfBirth) {
                    customer.dateOfBirth = customerDOBMap[customer.id];
                    await transactionManager.save(customer);
                }
            }
        });
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
