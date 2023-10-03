import { MigrationInterface, Not, QueryRunner } from "typeorm";
import { formatLoyaltyProgramCode } from "../../walkin-core/src/modules/common/utils/utils";
import { CustomerLoyaltyProgram, LoyaltyProgramConfig, LoyaltyProgramDetail, LoyaltyTransaction } from "../../walkin-rewardx/src/entity";

export class UpdateLoyaltyProgramCode1673441603833 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.connection.transaction(async transactionManager => {
            // Update experimentCode in LoyaltyProgramDetail
            const loyaltyProgramDetails = await transactionManager.find(LoyaltyProgramDetail, {
                cache: false,
                relations: ["organization", "loyaltyProgramConfig"]
            })

            for (const loyaltyProgramDetail of loyaltyProgramDetails) {
                const oldExperimentCode = loyaltyProgramDetail.experimentCode;
                const formattedExperimentCode = formatLoyaltyProgramCode(oldExperimentCode);

                // Check if any existing loyaltyProgramDetail has the formatted code
                const loyaltyProgramDetailWithFormattedCode = await transactionManager.findOne(LoyaltyProgramDetail, {
                    where: {
                        id: Not(loyaltyProgramDetail.id),
                        experimentCode: formattedExperimentCode,
                        organization: {
                            id: loyaltyProgramDetail.organization.id
                        }
                    },
                    cache: false
                })

                if (!loyaltyProgramDetailWithFormattedCode) {
                    loyaltyProgramDetail.experimentCode = formattedExperimentCode;

                    // Update code in LoyaltyProgramConfig
                    const loyaltyProgramConfig = loyaltyProgramDetail.loyaltyProgramConfig;
                    if (loyaltyProgramConfig) {
                        const oldLoyaltyProgramCode = loyaltyProgramConfig.code;
                        const formattedLoyaltyProgramCode = formatLoyaltyProgramCode(oldLoyaltyProgramCode);

                        const loyaltyProgramConfigWithFormattedCode = await transactionManager.findOne(LoyaltyProgramConfig, {
                            where: {
                                id: Not(loyaltyProgramConfig.id),
                                code: formattedLoyaltyProgramCode,
                                organization: {
                                    id: loyaltyProgramDetail.organization.id
                                }
                            },
                            cache: false
                        })

                        if (!loyaltyProgramConfigWithFormattedCode) {
                            loyaltyProgramConfig.code = formattedLoyaltyProgramCode;

                            await transactionManager.save(loyaltyProgramDetail);
                            await transactionManager.save(loyaltyProgramConfig);

                            // Update customer_loyalty_program => , loyalty_transaction => type
                            const customerLoyaltyPrograms = await transactionManager.find(CustomerLoyaltyProgram, {
                                cache: false,
                                where: {
                                    loyaltyProgramCode: oldLoyaltyProgramCode,
                                    loyaltyExperimentCode: oldExperimentCode
                                }
                            })

                            for (const customerLoyaltyProgram of customerLoyaltyPrograms) {
                                customerLoyaltyProgram.loyaltyProgramCode = formattedLoyaltyProgramCode;
                                customerLoyaltyProgram.loyaltyExperimentCode = formattedExperimentCode;
                                await transactionManager.save(customerLoyaltyProgram);

                                const loyaltyTransactions = await transactionManager.find(LoyaltyTransaction, {
                                    cache: false,
                                    where: {
                                        type: oldExperimentCode,
                                        customerLoyaltyProgram: {
                                            id: customerLoyaltyProgram.id
                                        }
                                    }
                                })

                                for (const loyaltyTransaction of loyaltyTransactions) {
                                    loyaltyTransaction.type = formattedExperimentCode
                                    await transactionManager.save(loyaltyTransaction);
                                }
                            }
                        }
                    }
                }
            }
        })
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
