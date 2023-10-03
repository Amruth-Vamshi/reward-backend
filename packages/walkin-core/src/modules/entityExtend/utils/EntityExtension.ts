import { EntityExtend, EntityExtendFields } from "../../../entity";
import { EntityManager } from "typeorm";
import {
  CACHE_TTL,
  CACHING_KEYS,
  EXPIRY_MODE,
  SLUGTYPE
} from "../../common/constants/constants";
import {
  getValueFromCache,
  setValueToCache
} from "../../common/utils/redisUtils";

export async function validateAndReturnEntityExtendedData(
  entityManager: EntityManager,
  extendedDataString: any,
  organizationId: string,
  entityName: string
) {
  const key = `${CACHING_KEYS.ENTITY_EXTEND}_${entityName}_${organizationId}`;
  let entityExtend: any = await getValueFromCache(key);
  if (!entityExtend) {
    entityExtend = await entityManager.findOne(EntityExtend, {
      where: {
        entityName,
        organization: {
          id: organizationId
        }
      },
      relations: ["fields"]
    });
    if (entityExtend) {
      await setValueToCache(key, entityExtend, EXPIRY_MODE.EXPIRE, CACHE_TTL);
      console.log("Fetched from Database and added to Cache with key :", key);
    }
  } else {
    console.log("Fetched from Cache with key :", key);
  }
  const entityExtendResult = {};
  if (entityExtend == null || entityExtend == undefined) {
    // TOOD: EE Throw proper error
    throw new Error(`EntityExtend with id ${entityExtend.id} is not defined`);
  }
  const entityExtendFields = entityExtend.fields;
  let extendedData: Object;
  if (typeof extendedDataString == "string") {
    try {
      extendedData = JSON.parse(extendedDataString);
    } catch (e) {
      throw new Error(`Extended Data is not a valid JSON`);
    }
  } else {
    extendedData = extendedDataString;
  }

  for (const index in entityExtendFields) {
    const entityExtendField = entityExtendFields[index];
    const key = entityExtendField.slug;
    if (entityExtendField) {
      if (extendedData[key] == undefined && !entityExtendField.required)
        continue;
      const valid = validateEntendedField(
        key,
        extendedData[key],
        entityExtendField
      );
      if (valid) {
        entityExtendResult[key] = extendedData[key];
      } else {
        throw new Error(
          `EntityExtendField ${entityExtendField.slug} has invalid value provided.`
        );
      }
    } else {
      throw new Error(
        `EntityExtendField ${key} is not a valid extended field.`
      );
    }
  }
  return entityExtendResult;
}

function getEntityExtendFieldForSlug(
  slugName: string,
  entityExtendFields: EntityExtendFields[]
) {
  let entityExtendField = null;
  for (let i = 0; i < entityExtendFields.length; i++) {
    if (slugName === entityExtendFields[i].slug) {
      entityExtendField = entityExtendFields[i];
    }
  }
  return entityExtendField;
}

export function validateEntendedField(
  slugName: String,
  data: Object,
  entityExtendField: EntityExtendFields
) {
  const dataType = entityExtendField.type;

  // check for type
  let typeCheckPass = false;
  switch (dataType) {
    case SLUGTYPE.BOOLEAN:
      typeCheckPass = validateTypeOfData(data, "boolean");
      break;
    case SLUGTYPE.SHORT_TEXT:
      typeCheckPass = validateTypeOfData(data, "string");
      break;
    case SLUGTYPE.LONG_TEXT:
      typeCheckPass = validateTypeOfData(data, "string");
      break;
    case SLUGTYPE.NUMBER:
      typeCheckPass = validateTypeOfData(data, "number");
      break;
    case SLUGTYPE.JSON:
      typeCheckPass = validateTypeOfData(data, "object");
      break;
  }

  // TODO: EE check for not-null & see if default is present
  // TODO: EE check for regex

  return typeCheckPass;
}

function validateTypeOfData(data: Object, dataType: String) {
  if (typeof data == dataType) {
    return true;
  }
  return false;
}
