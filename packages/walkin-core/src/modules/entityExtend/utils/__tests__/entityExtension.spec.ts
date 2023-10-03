import { getManager, getConnection, EntityManager } from "typeorm";
import { EntityExtendProvider } from "../../entityExtend.providers";
import { entityExtendModule } from "../../entityExtend.module";
import { validateEntendedField } from "../EntityExtension";
import { SLUGTYPE } from "../../../common/constants";
import * as WCoreEntities from "../../../../entity";
import {
  createUnitTestConnection,
  getAdminUser,
  closeUnitTestConnection
} from "../../../../../__tests__/utils/unit";

let entityExtend: WCoreEntities.EntityExtend;
let user: WCoreEntities.User;

const entityExtendService: EntityExtendProvider = entityExtendModule.injector.get(
  EntityExtendProvider
);

beforeAll(async () => {
  await createUnitTestConnection(WCoreEntities);
  ({ user } = await getAdminUser(getConnection()));
  const manager = getManager();
  entityExtend = await entityExtendService.createEntityExtend(
    manager,
    user.organization.id,
    "Customer",
    "Customer entities"
  );
});

describe("validate extended field is working properly", () => {
  test("correctly validates the data types", async () => {
    const manager = getManager();
    let eef_number = await entityExtendService.createEntityExtendField(
      manager,
      entityExtend.id,
      "extend_number_field",
      "number_field",
      "",
      SLUGTYPE.NUMBER,
      false,
      [],
      "",
      "",
      "",
      false
    );
    let eef_short_text = await entityExtendService.createEntityExtendField(
      manager,
      entityExtend.id,
      "extend_short_text",
      "short_text",
      "",
      SLUGTYPE.SHORT_TEXT,
      false,
      [],
      "",
      "",
      "",
      false
    );
    let eef_long_text = await entityExtendService.createEntityExtendField(
      manager,
      entityExtend.id,
      "extend_long_text",
      "long_text",
      "",
      SLUGTYPE.LONG_TEXT,
      false,
      [],
      "",
      "",
      "",
      false
    );
    let eef_bool = await entityExtendService.createEntityExtendField(
      manager,
      entityExtend.id,
      "extend_bool",
      "bool",
      "",
      SLUGTYPE.BOOLEAN,
      false,
      [],
      "",
      "",
      "",
      false
    );
    let eef_json = await entityExtendService.createEntityExtendField(
      manager,
      entityExtend.id,
      "extend_json",
      "json",
      "",
      SLUGTYPE.JSON,
      false,
      [],
      "",
      "",
      "",
      false
    );

    expect(validateEntendedField("extend_number_field", 4, eef_number)).toBe(
      true
    );
    expect(
      validateEntendedField(
        "short_text_field",
        "short test test",
        eef_short_text
      )
    ).toBe(true);
    expect(
      validateEntendedField("long_text_field", "long test test", eef_long_text)
    ).toBe(true);
    expect(validateEntendedField("bool_field", false, eef_bool)).toBe(true);
    expect(
      validateEntendedField("object_field", { object_field: 4 }, eef_json)
    ).toBe(true);
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
