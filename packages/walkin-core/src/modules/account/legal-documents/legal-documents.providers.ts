import { Injectable, Inject } from "@graphql-modules/di";
import {
  WalkinRecordNotFoundError,
  WalkinPlatformError,
  WalkinError,
} from "../../common/exceptions/walkin-platform-error";
import { validateAndReturnEntityExtendedData } from "../../entityExtend/utils/EntityExtension";
import {
  Organization,
  LegalDocument,
} from "../../../entity";
import { OrganizationTypeEnum } from "../../../graphql/generated-models";
import { Organizations } from "../organization/organization.providers";
import {
  ORGANIZATION_TYPES,
  STATUS,
  ENUM_DELIVERY_LOCATION_TYPE,
  AREA_TYPE,
  ENUM_DAY,
} from "../../common/constants";
import {
  executeQuery,
  frameFinalQueries,
  combineExpressions,
  updateEntity,
  frameDynamicSQLFromJexl,
  frameTextFromSQLExpresion,
  addPaginateInfo,
  removeDuplicates,
  checkTimeValidity,
} from "../../common/utils/utils";
import { EntityManager, In } from "typeorm";
import { WCoreError } from "../../common/exceptions";
import { REWARDX_ERRORS } from "@walkinserver/walkin-rewardx/src/modules/common/constants/errors";
import { WCORE_ERRORS } from "@walkinserver/walkin-core/src/modules/common/constants/errors";
import { ChannelProvider } from "../../productcatalog/channel/channel.providers";
import {
  validationDecorator,
  isValidPhone,
  isValidEmail,
} from "../../common/validations/Validations";
import { ProductProvider } from "../../productcatalog/product/product.providers";
import { performance } from "perf_hooks";
import { forEach, find } from "lodash";
import { StoreServiceArea } from "../../../entity/StoreServiceArea";

export interface ILegalDocuments {
  id?: string;
  organizationId?: string;
  legalDocumentValue?: string;
  legalDocumentInfo?: string;
  legalDocumentUrl?: string;
  legalDocumentType?: string;
}

@Injectable()
export class LegalDocumentsProvider {
  /**
   * addLegalOrganizationDocument
   */
  public async addLegalOrganizationDocument(
    entityManager: EntityManager,
    input: ILegalDocuments
  ): Promise<LegalDocument> {
    const {
      legalDocumentInfo,
      legalDocumentType,
      legalDocumentUrl,
      legalDocumentValue,
      organizationId,
    } = input;
    const existingOrganization = await entityManager.findOne(Organization, {
      where: {
        id: organizationId,
      },
    });
    if (!existingOrganization) {
      throw new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND);
    }

    const legalOrganizationSchema = {
      legalDocumentInfo,
      legalDocumentType,
      legalDocumentUrl,
      legalDocumentValue,
      organization: existingOrganization,
    };
    const createdlegalOrganizationDocument = await entityManager.create(
      LegalDocument,
      legalOrganizationSchema
    );
    const savedCreatedlegalOrganizationDocument = await entityManager.save(
      createdlegalOrganizationDocument
    );
    return savedCreatedlegalOrganizationDocument;
  }

  /**
   * updateLegalOrganizationDocument
   */
  public async updateLegalOrganizationDocument(
    entityManager: EntityManager,
    input: ILegalDocuments
  ): Promise<LegalDocument> {
    const {
      id,
      legalDocumentInfo,
      legalDocumentType,
      legalDocumentUrl,
      legalDocumentValue,
      organizationId,
    } = input;
    const existinglegalOrganizationDocument = await entityManager.findOne(
      LegalDocument,
      {
        where: {
          id,
        },
        relations: ["organization"],
      }
    );
    if (!existinglegalOrganizationDocument) {
      throw new WCoreError(WCORE_ERRORS.LEGAL_DOCUMENT_NOT_FOUND);
    }
    const updatedEntityLegalDocument = updateEntity(
      existinglegalOrganizationDocument,
      input
    );

    const saveUpdatedValues = await entityManager.save(
      updatedEntityLegalDocument
    );

    return saveUpdatedValues;
  }

  /**
   * getLegalOrganizationDocument
   */
  public async getLegalOrganizationDocument(
    entityManager: EntityManager,
    input: any
  ): Promise<LegalDocument> {
    const { id } = input;
    const existingLegealOrganizationDocument = await await entityManager.findOne(
      LegalDocument,
      {
        where: {
          id,
        },
        relations: ["organization"],
      }
    );
    if (!existingLegealOrganizationDocument) {
      throw new WCoreError(WCORE_ERRORS.LEGAL_DOCUMENT_NOT_FOUND);
    }
    return existingLegealOrganizationDocument;
  }

  /**
   * getLegalOrganizationDocuments
   */
  public async getLegalOrganizationDocuments(
    entityManager: EntityManager,
    input: any
  ): Promise<LegalDocument[]> {
    const { organizationId } = input;
    const existingOrganization = await entityManager.findOne(Organization, {
      where: {
        id: organizationId,
      },
    });
    if (!existingOrganization) {
      throw new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND);
    }
    const existingLegealOrganizationDocument = await await entityManager.find(
      LegalDocument,
      {
        where: {
          organization: {
            id: organizationId,
          },
        },
        relations: ["organization"],
      }
    );
    return existingLegealOrganizationDocument;
  }
}
