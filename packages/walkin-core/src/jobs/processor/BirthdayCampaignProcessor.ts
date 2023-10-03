import moment from "moment";
import { Service } from "typedi";
import { CustomerLoyalty, LoyaltyProgramDetail } from "../../../../walkin-rewardx/src/entity";
import { evaluateLoyaltyProgram } from "../../../../walkin-rewardx/src/modules/common/utils/LoyaltyProgramUtils";
import { IScheduleCampaignProcessor } from "../../modules/common/constants";
import { hash } from "../../modules/common/utils/utils";
import { customerModule } from "../../modules/customer/customer.module";
import { CustomerProvider as Customer } from "../../modules/customer/customer.providers";
import { v4 as uuidv4 } from "uuid";

const CustomerProvider = customerModule.injector.get(Customer);

@Service()
export class BirthdayCampaignProcessor implements IScheduleCampaignProcessor {
    getItems = async (transactionManager, organizationId) => {
        // Fetch all customers celebrating Birthday for an Organization
        const customers = await CustomerProvider.getAllCustomersCelebratingBirthdayToday(transactionManager, organizationId);
        return customers;
    }

    processItems = async (transactionManager, input) => {
        /**
         * 1. Get customer loyalty for each customer celebrating Birthday
         * 2. Invoke evaluateLoyaltyProgram util function
         */
        const { customersCelebratingBirthday, loyaltyProgramDetailId, organizationId } = input;
        console.log("Customers Celebrating Birthday:", customersCelebratingBirthday.length);
        if (customersCelebratingBirthday.length > 0) {
            const loyaltyProgramDetail = await transactionManager
                .getRepository(LoyaltyProgramDetail)
                .createQueryBuilder("loyaltyProgramDetail")
                .leftJoinAndSelect("loyaltyProgramDetail.loyaltyProgramConfig", "loyaltyProgramConfig")
                .leftJoinAndSelect("loyaltyProgramConfig.loyaltyCard", "loyaltyCard")
                .where("loyaltyProgramDetail.id= :loyaltyProgramDetailId", {
                    loyaltyProgramDetailId
                })
                .getOne();
            if (loyaltyProgramDetail) {
                console.log("Found loyaltyProgramDetail", loyaltyProgramDetailId);
                const loyaltyProgramConfig = loyaltyProgramDetail.loyaltyProgramConfig;
                if (loyaltyProgramConfig) {
                    console.log("Found loyaltyProgramConfig");
                    const loyaltyCardId = loyaltyProgramConfig.loyaltyCard?.id;
                    if (loyaltyCardId) {
                        console.log("Found loyaltyCardId", loyaltyCardId);
                        for (const customer of customersCelebratingBirthday) {
                            const customerId = customer.id;
                            console.log("customerId", customerId);
                            let customerLoyalty;
                            customerLoyalty = await transactionManager.find(
                                CustomerLoyalty,
                                {
                                    where: {
                                        customer: customer.id,
                                        loyaltyCard: loyaltyCardId
                                    },
                                    relations: ["customer", "loyaltyCard"]
                                }
                            )
                            customerLoyalty = customerLoyalty?.pop();
                            console.log("customerLoyalty", customerLoyalty?.id);
                            if (customerLoyalty) {
                                const loyaltyReferenceId = uuidv4();
                                const evaluateLoyaltyProgramResult = await evaluateLoyaltyProgram(
                                    transactionManager,
                                    customerModule.injector,
                                    organizationId,
                                    loyaltyProgramDetailId,
                                    {
                                        loyaltyType: loyaltyProgramDetail.experimentCode,
                                        externalCustomerId: customer.externalCustomerId,
                                        loyaltyReferenceId,
                                        data: {
                                            date: [
                                                moment().format("YYYY"),
                                                moment().format("MM"),
                                                moment().format("DD"),
                                                moment().format("HH"),
                                                moment().format("mm"),
                                                moment().format("ss")
                                            ],
                                            customer: customerLoyalty
                                        }
                                    }
                                )
                                console.log("evaluateLoyaltyProgramResult", evaluateLoyaltyProgramResult);
                            }
                        }
                    }
                }
            }
        }
    }
}