import Dataloader from "dataloader";
import { getManager, In } from "typeorm";
import { ProductChargeValue } from "../../../entity";

export const chargeValueLoader = () => {
  return new Dataloader(getProductByChargeValue);
};

async function getProductByChargeValue(chargeValues) {
  const chargeValueIds = chargeValues.map(chargeValue => chargeValue.id);
  const productChargeValues = await getManager()
    .getRepository(ProductChargeValue)
    .createQueryBuilder("productChargeValue")
    .leftJoinAndSelect("productChargeValue.product", "product")
    .where("productChargeValue.id IN (:...chargeValueIds)", {
      chargeValueIds
    })
    .getMany();
  let products = [];
  for (const productChargeValue of productChargeValues) {
    products.push(productChargeValue.product);
  }
  return products;
}
