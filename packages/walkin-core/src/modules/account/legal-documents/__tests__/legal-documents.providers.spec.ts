import * as CoreEntities from "../../../../entity";
import {
  closeUnitTestConnection,
  createUnitTestConnection,
  getAdminUser,
} from "../../../../../__tests__/utils/unit";
import { getManager, getConnection, EntityManager } from "typeorm";
import { Chance } from "chance";
import { StoreModule } from "../../store/store.module";
import { Stores, StoreOpenTimingProvider } from "../../store/store.providers";
import { StoreFormatModule } from "../../../productcatalog/storeformat/storeFormat.module";
import { StoreFormatProvider } from "../../../productcatalog/storeformat/storeFormat.providers";
import { TaxTypeModule } from "../../../productcatalog/taxtype/taxtype.module";
import { TaxTypeProvider } from "../../../productcatalog/taxtype/taxtype.providers";
import { ChannelModule } from "../../../productcatalog/channel/channel.module";
import { ChannelProvider } from "../../../productcatalog/channel/channel.providers";
import { CatalogModule } from "../../../productcatalog/catalog/catalog.module";
import { CatalogProvider } from "../../../productcatalog/catalog/catalog.providers";
import {
  ENUM_DAY,
  STATUS,
  AREA_TYPE,
  ENUM_DELIVERY_LOCATION_TYPE,
  STAFF_ROLE,
  STORE_SERVICE_AREA_TYPE,
  LEGAL_DOCUMENT_TYPE,
} from "../../../common/constants/constants";
import { WCORE_ERRORS } from "../../../common/constants/errors";
import { WCoreError } from "../../../common/exceptions";
import { LegalDocumentsModule } from "../legal-documents.module";
import {
  LegalDocumentsProvider,
  ILegalDocuments,
} from "../legal-documents.providers";
const storeFormatProvider = StoreFormatModule.injector.get(StoreFormatProvider);
const taxTypeProvider = TaxTypeModule.injector.get(TaxTypeProvider);
const channelProvider = ChannelModule.injector.get(ChannelProvider);
const catalogProvider = CatalogModule.injector.get(CatalogProvider);
const legalDocumetProvider = LegalDocumentsModule.injector.get(
  LegalDocumentsProvider
);
let user: CoreEntities.User;
const chance = new Chance();

beforeAll(async () => {
  await createUnitTestConnection(CoreEntities);
  ({ user } = await getAdminUser(getConnection()));
});

const storeProvider: Stores = StoreModule.injector.get(Stores);
const storeOpenTimingProvider: StoreOpenTimingProvider = StoreModule.injector.get(
  StoreOpenTimingProvider
);

describe("Add  legal Document Info", () => {
  test("should add legal document info", async () => {
    const manager = getManager();
    const legalDocumentSchema = {
      organizationId: user.organization.id,
      legalDocumentValue: chance.bb_pin(),
      legalDocumentType: LEGAL_DOCUMENT_TYPE.GST_NUMBER,
      legalDocumentUrl: chance.url(),
    };
    const addLegalDocument = await legalDocumetProvider.addLegalOrganizationDocument(
      manager,
      legalDocumentSchema
    );
    expect(addLegalDocument).toBeDefined();
    expect(addLegalDocument.id).toBeDefined();
    expect(addLegalDocument.legalDocumentType).toBe(
      legalDocumentSchema.legalDocumentType
    );
  });

  test("should fail to add legal document info for invalid org", async () => {
    const manager = getManager();
    const legalDocumentSchema = {
      organizationId: chance.guid(),
      legalDocumentValue: chance.bb_pin(),
      legalDocumentType: LEGAL_DOCUMENT_TYPE.GST_NUMBER,
      legalDocumentUrl: chance.url(),
    };

    try {
      const addLegalDocument = await legalDocumetProvider.addLegalOrganizationDocument(
        manager,
        legalDocumentSchema
      );
    } catch (error) {
      expect(error).toEqual(
        new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND)
      );
    }
  });
});

describe("Update  legal Document Info", () => {
  test("should update legal document info", async () => {
    const manager = getManager();
    const legalDocumentSchema = {
      organizationId: user.organization.id,
      legalDocumentValue: chance.bb_pin(),
      legalDocumentType: LEGAL_DOCUMENT_TYPE.GST_NUMBER,
      legalDocumentUrl: chance.url(),
    };
    const addLegalDocument = await legalDocumetProvider.addLegalOrganizationDocument(
      manager,
      legalDocumentSchema
    );
    const updateSchema = {
      id: addLegalDocument.id,
      legalDocumentUrl: chance.url(),
    };
    const updateLegalDocumentInfo = await legalDocumetProvider.updateLegalOrganizationDocument(
      manager,
      updateSchema
    );

    expect(updateLegalDocumentInfo).toBeDefined();
    expect(updateLegalDocumentInfo.legalDocumentUrl).toBe(
      updateSchema.legalDocumentUrl
    );
  });

  test("should fail to update legal document info for invalid org", async () => {
    const manager = getManager();
    const legalDocumentSchema = {
      organizationId: user.organization.id,
      legalDocumentValue: chance.bb_pin(),
      legalDocumentType: LEGAL_DOCUMENT_TYPE.GST_NUMBER,
      legalDocumentUrl: chance.url(),
    };
    const addLegalDocument = await legalDocumetProvider.addLegalOrganizationDocument(
      manager,
      legalDocumentSchema
    );
    const updateSchema = {
      id: chance.guid(),
      legalDocumentUrl: chance.url(),
    };
    try {
      const updateLegalDocumentInfo = await legalDocumetProvider.updateLegalOrganizationDocument(
        manager,
        updateSchema
      );

      expect(updateLegalDocumentInfo).toBeDefined();
      expect(updateLegalDocumentInfo.legalDocumentUrl).toBe(
        updateSchema.legalDocumentUrl
      );
    } catch (error) {
      expect(error).toEqual(
        new WCoreError(WCORE_ERRORS.LEGAL_DOCUMENT_NOT_FOUND)
      );
    }
  });
});

describe("Update  fetch Document Info", () => {
  test("should fetch legal document info", async () => {
    const manager = getManager();
    const legalDocumentSchema = {
      organizationId: user.organization.id,
      legalDocumentValue: chance.bb_pin(),
      legalDocumentType: LEGAL_DOCUMENT_TYPE.GST_NUMBER,
      legalDocumentUrl: chance.url(),
    };
    const addLegalDocument = await legalDocumetProvider.addLegalOrganizationDocument(
      manager,
      legalDocumentSchema
    );

    const getDocumentInfo = await legalDocumetProvider.getLegalOrganizationDocument(
      manager,
      { id: addLegalDocument.id }
    );

    expect(getDocumentInfo).toBeDefined();
    expect(getDocumentInfo.id).toBeDefined();
  });

  test("should fetch all documents for an organization", async () => {
    const manager = getManager();
    const legalDocumentSchema = {
      organizationId: user.organization.id,
      legalDocumentValue: chance.bb_pin(),
      legalDocumentType: LEGAL_DOCUMENT_TYPE.GST_NUMBER,
      legalDocumentUrl: chance.url(),
    };
    const addLegalDocument = await legalDocumetProvider.addLegalOrganizationDocument(
      manager,
      legalDocumentSchema
    );
    const updateSchema = {
      id: chance.guid(),
      legalDocumentUrl: chance.url(),
    };
    const getLegalOrganizationDocument = await legalDocumetProvider.getLegalOrganizationDocuments(
      manager,
      {
        organizationId: user.organization.id,
      }
    );
    expect(getLegalOrganizationDocument).toBeDefined();
    expect(getLegalOrganizationDocument.length).toBeGreaterThan(0);
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
