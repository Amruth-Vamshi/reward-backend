import Dataloader from "dataloader";
import { getManager, In } from "typeorm";
import { CatalogUsage } from "../../../entity";

export const catalogUsageLoader = () => {
    return new Dataloader(getCatalogUsage);
};

async function getCatalogUsage(catalogs) {
    const catalogIds = catalogs.map(catalog => catalog.id);
    const organizationId = catalogs[0].organizationId;
    const catalogUsageMapping = {};

    const catalogUsageValues = await getManager().find(CatalogUsage, {
        where: {
            catalogId: In(catalogIds),
            organizationId
        }
    });

    for (const catalogUsage of catalogUsageValues) {
        const catalogId = catalogUsage.catalogId;
        catalogUsageMapping[catalogId] = catalogUsage;
    }

    return catalogIds.map(id =>
        catalogUsageMapping[id] ? catalogUsageMapping[id] : {}
    );
}