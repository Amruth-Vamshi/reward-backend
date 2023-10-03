import { GraphQLModule } from "@graphql-modules/core";
import { CatalogModule } from "./catalog/catalog.module";
import { CategoryModule } from "./category/category.module";
import { OptionModule } from "./option/option.module";
import { ProductModule } from "./product/product.module";
import { TaxTypeModule } from "./taxtype/taxtype.module";
import { StoreFormatModule } from "./storeformat/storeFormat.module";
import { ChargeModule } from "./chargeType/chargeType.module";
import { ChannelModule } from "./channel/channel.module";
import { ProductTaxValueModule } from "./productTaxValue/productTaxValue.module";
import { ProductChargeValueModule } from "./productChargeValue/productChargeValue.module";
import { ProductPriceValueModule } from "./productPriceValue/productPriceValue.module";
import { TagModule } from "./tag/tag.module";
import { CollectionModule } from "./collection/collection.module";
import { ProductCollectionModule } from "./productCollection/productCollection.module";
import { ProductTagModule } from "./productTag/productTag.module";
import { ProductRelationshipModule } from "./productRelationship/productRelationship.module";
import { StoreChargeModule } from "./storeCharges/storeCharge.module";
import { StoreInventoryModule } from "./storeInventory/storeInventory.module";
import { DiscountTypeModule } from "./discountType/discountType.module";
import { ProductDiscountValueModule } from "./productDiscountValue/productDiscountValue.module";
import { MenuTimingModule } from "./menuTiming/menuTiming.module";

export const productCatalogModule = new GraphQLModule({
  name: "ProductCatalog",
  imports: [
    CatalogModule,
    CategoryModule,
    ProductModule,
    OptionModule,
    ChargeModule,
    ChannelModule,
    TaxTypeModule,
    StoreFormatModule,
    ProductTaxValueModule,
    ProductChargeValueModule,
    ProductPriceValueModule,
    TagModule,
    CollectionModule,
    ProductTagModule,
    ProductCollectionModule,
    ProductRelationshipModule,
    StoreChargeModule,
    StoreInventoryModule,
    DiscountTypeModule,
    ProductDiscountValueModule,
    MenuTimingModule
  ]
});
