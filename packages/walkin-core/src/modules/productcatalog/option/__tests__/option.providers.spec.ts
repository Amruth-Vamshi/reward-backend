// import { getConnection } from "typeorm";

import { getManager, getConnection, EntityManager } from "typeorm";
import { OptionProvider, OptionValueProvider } from "../option.providers";
import { OptionModule } from "../option.module";
import * as WCoreEntities from "../../../../entity";
import Chance from "chance";
import * as resolvers from "../option.resolvers";

import {
  createUnitTestConnection,
  getAdminUser,
  closeUnitTestConnection
} from "../../../../../__tests__/utils/unit";
import { STATUS } from "../../../common/constants";
import { ApplicationProvider } from "../../../account/application/application.providers";
import { ApplicationModule } from "../../../account/application/application.module";
import { WCORE_ERRORS } from "../../../common/constants/errors";
import { WCoreError } from "../../../common/exceptions";
import { optionsLoader } from "../option.loader";
let user: WCoreEntities.User;
const chance = new Chance();

jest.mock("i18n");

const catalogInput1 = {
  name: "Pizzahut",
  description: "Pizzahut catalog"
};

const categoryInput = {
  name: "Category 1",
  description: "Category 1 description",
  status: STATUS.ACTIVE,
  code: "CAT_1"
};

const categoryInput2 = {
  name: "Category 2",
  description: "new description"
};

const productInput = {
  name: "Product 1",
  description: "Product desc",
  code: "PRODUCT_CODE",
  status: STATUS.ACTIVE,
  categoryIds: []
};

const productInput2 = {
  name: "product 2",
  description: "product description2"
};

const option1 = {
  name: "Size",
  description: "Size",
  optionValues: [
    {
      value: "Small"
    },
    {
      value: "Medium"
    },
    { value: "Large" }
  ]
};

const option2 = {
  name: "Crust",
  description: "Crust",
  optionValues: [{ value: "Thin" }, { value: "Cheesy" }]
};

const optionService: OptionProvider = OptionModule.injector.get(OptionProvider);
const optionValueService: OptionValueProvider = OptionModule.injector.get(
  OptionValueProvider
);

const applicationService: ApplicationProvider = ApplicationModule.injector.get(
  ApplicationProvider
);

beforeAll(async () => {
  await createUnitTestConnection(WCoreEntities);
  ({ user } = await getAdminUser(getConnection()));
  const manager = getManager();
});

describe("Testing Query.options", () => {
  test("should getAllOptions", async () => {
    const manager = getManager();
    const optionObject = await optionService.createOption(manager, option1);
    const optionObject2 = await optionService.createOption(manager, option2);

    const optionInput = {
      name: chance.string({ length: 3 }),
      description: chance.string({ length: 6 }),
      organizationId: user.organization.id
    };

    await optionService.createOption(manager, optionInput);
    const input = {
      organizationId: user.organization.id
    };
    const options: [WCoreEntities.Option] = await optionService.getAllOptions(
      manager,
      input
    );
    expect(options.length).toBe(1);
    expect(options[0].name).toBe(optionInput.name);
    expect(options[0].description).toBe(optionInput.description);
  });

  test("should getOption By Id", async () => {
    const manager = getManager();

    const optionInput = {
      name: chance.string({ length: 3 }),
      description: chance.string({ length: 6 }),
      organizationId: user.organization.id
    };

    const createOption = await optionService.createOption(manager, optionInput);
    const input = {
      id: createOption.id
    };

    let application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      user.organization.id
    );

    const option = await resolvers.default.Query.optionById(
      { user, application },
      input,
      { injector: OptionModule.injector }
    );
    expect(option).toBeDefined();
    expect(option.id).toEqual(createOption.id);
    expect(option.name).toEqual(createOption.name);
  });
});

describe("Testing Mutation.options", () => {
  test("should create Option", async () => {
    const manager = getManager();

    const optionInput = {
      name: "Test-name-1",
      description: chance.string({ length: 6 }),
      organizationId: user.organization.id,
      externalOptionId: "testId12",
      code: "testCode12",
      sortSeq: chance.integer({ min: 0 })
    };

    let application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      user.organization.id
    );

    const createdOption = await resolvers.default.Mutation.createOption(
      { user, application },
      { input: optionInput },
      { injector: OptionModule.injector }
    );

    expect(createdOption).toBeDefined();
    expect(createdOption.name).toBe("Test-name-1");
    expect(createdOption.externalOptionId).toBe("testId12");
    expect(createdOption.code).toBe("testCode12");
    expect(createdOption.sortSeq).toBe(optionInput.sortSeq);
  });

  test("should create Option with option values having sortseq", async () => {
    const manager = getManager();

    const optionInput = {
      name: "Test-name-1",
      description: chance.string({ length: 6 }),
      organizationId: user.organization.id,
      externalOptionId: "testId12",
      code: "testCode12",
      sortSeq: chance.integer({ min: 0 }),
      optionValues: [{
        value: chance.string(),
        code: chance.string(),
        sortSeq: chance.integer({ min: 0 })
      }]
    };

    let application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      user.organization.id
    );

    const createdOption = await resolvers.default.Mutation.createOption(
      { user, application },
      { input: optionInput },
      { injector: OptionModule.injector }
    );

    expect(createdOption).toBeDefined();
    expect(createdOption.name).toBe("Test-name-1");
    expect(createdOption.externalOptionId).toBe("testId12");
    expect(createdOption.code).toBe("testCode12");
    expect(createdOption.sortSeq).toBe(optionInput.sortSeq);
  });

  test("should update Option", async () => {
    const manager = getManager();

    const optionInput = {
      name: "Test-name-12",
      description: chance.string({ length: 6 }),
      organizationId: user.organization.id
    };

    const createdOption = await optionService.createOption(
      manager,
      optionInput
    );

    const updateOptionInput = {
      id: createdOption.id,
      name: "Test-name-2",
      externalOptionId: "testId1",
      code: "testCode1",
      sortSeq: chance.integer({ min: 0 })
    };

    let application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      user.organization.id
    );

    const updateOption = await resolvers.default.Mutation.updateOption(
      { user, application },
      { input: updateOptionInput },
      { injector: OptionModule.injector }
    );

    expect(createdOption).toBeDefined();
    expect(createdOption.name).toBe("Test-name-12");
    expect(updateOption).toBeDefined();
    expect(updateOption.name).toBe("Test-name-2");
    expect(updateOption.externalOptionId).toBe("testId1");
    expect(updateOption.code).toBe("testCode1");
    expect(updateOption.sortSeq).toBe(updateOptionInput.sortSeq);
  });

  test("should update Option provided a list of options", async () => {
    const manager = getManager();

    const optionInput1 = {
      name: "Test-name-12",
      description: chance.string({ length: 6 }),
      organizationId: user.organization.id
    };

    const createdOption1 = await optionService.createOption(
      manager,
      optionInput1
    );

    const optionInput2 = {
      name: "Test-name-12",
      description: chance.string({ length: 6 }),
      organizationId: user.organization.id
    };

    const createdOption2 = await optionService.createOption(
      manager,
      optionInput2
    );

    const updateOptionInput = {
      organizationId: user.organization.id,
      optionSeq: [
        {
          id: createdOption1.id,
          name: chance.string(),
          externalOptionId: chance.string(),
          code: chance.string(),
          sortSeq: chance.integer({ min: 0 })
        },
        {
          id: createdOption2.id,
          name: chance.string(),
          externalOptionId: chance.string(),
          code: chance.string(),
          sortSeq: chance.integer({ min: 0 })
        }
      ]
    };

    let application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      user.organization.id
    );

    const updateOption = await resolvers.default.Mutation.updateOptionSortSeq(
      { user, application },
      { input: updateOptionInput },
      { injector: OptionModule.injector }
    );

    expect(createdOption1).toBeDefined();
    expect(createdOption2).toBeDefined();
    expect(updateOption).toBeDefined();
    expect(updateOption.length).toBe(updateOptionInput.optionSeq.length);
    expect(updateOption[0].sortSeq).toBe(
      updateOptionInput.optionSeq[0].sortSeq
    );
    expect(updateOption[1].sortSeq).toBe(
      updateOptionInput.optionSeq[1].sortSeq
    );
  });

  test("should FAIL to update Option provided a list of options given invalid option id", async () => {
    const manager = getManager();

    const optionInput1 = {
      name: "Test-name-12",
      description: chance.string({ length: 6 }),
      organizationId: user.organization.id
    };

    const createdOption1 = await optionService.createOption(
      manager,
      optionInput1
    );

    const optionInput2 = {
      name: "Test-name-12",
      description: chance.string({ length: 6 }),
      organizationId: user.organization.id
    };

    const createdOption2 = await optionService.createOption(
      manager,
      optionInput2
    );

    const updateOptionInput = {
      organizationId: user.organization.id,
      optionSeq: [
        {
          id: chance.integer(),
          name: chance.string(),
          externalOptionId: chance.string(),
          code: chance.string(),
          sortSeq: chance.integer({ min: 0 })
        },
        {
          id: createdOption2.id,
          name: chance.string(),
          externalOptionId: chance.string(),
          code: chance.string(),
          sortSeq: chance.integer({ min: 0 })
        }
      ]
    };

    let application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      user.organization.id
    );

    try {
      await resolvers.default.Mutation.updateOptionSortSeq(
        { user, application },
        { input: updateOptionInput },
        { injector: OptionModule.injector }
      );
    } catch (error) {
      const optionNotFoundError = WCORE_ERRORS.OPTION_NOT_FOUND;
      optionNotFoundError.MESSAGE = `Option ${updateOptionInput.optionSeq[0].id} not found`;
      expect(error).toEqual(new WCoreError(optionNotFoundError));
    }
  });

  test("should FAIL to update Option provided a list of options given invalid option details", async () => {
    const manager = getManager();

    const updateOptionInput = {
      organizationId: user.organization.id,
      optionSeq: []
    };

    let application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      user.organization.id
    );

    try {
      await resolvers.default.Mutation.updateOptionSortSeq(
        { user, application },
        { input: updateOptionInput },
        { injector: OptionModule.injector }
      );
    } catch (error) {
      expect(error).toEqual(new WCoreError(WCORE_ERRORS.OPTION_DETAILS_EMPTY));
    }
  });

  test("should create OptionValue", async () => {
    const manager = getManager();

    const optionInput = {
      name: "Test-name-664",
      description: chance.string({ length: 6 }),
      organizationId: user.organization.id
    };

    const createdOption = await optionService.createOption(
      manager,
      optionInput
    );

    const optionValueInput = {
      optionId: createdOption.id,
      value: "Large-12",
      externalOptionValueId: "testOptionValueId1",
      code: "testOptionValueCode1"
    };

    let application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      user.organization.id
    );

    const createOptionValue = await resolvers.default.Mutation.createOptionValue(
      { user, application },
      { input: optionValueInput },
      { injector: OptionModule.injector }
    );

    expect(createOptionValue).toBeDefined();
    expect(createOptionValue.value).toBe("Large-12");
    expect(createOptionValue.externalOptionValueId).toBe("testOptionValueId1");
    expect(createOptionValue.code).toBe("testOptionValueCode1");
  });

  test("should fetch all option related to optionValue", async () => {
    const manager = getManager();

    const optionInput = {
      name: "Test-name-664",
      description: chance.string({ length: 6 }),
      organizationId: user.organization.id
    };

    const createdOption = await optionService.createOption(
      manager,
      optionInput
    );

    const externalOptionValueId = "testOptionValueId1";
    const code = "testOptionValueCode1";
    const value = "Large-12";
    const optionValueInput = {
      optionId: createdOption.id,
      value,
      externalOptionValueId,
      code
    };

    let application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      user.organization.id
    );

    const createOptionValue = await resolvers.default.Mutation.createOptionValue(
      { user, application },
      { input: optionValueInput },
      { injector: OptionModule.injector }
    );

    expect(createOptionValue).toBeDefined();
    expect(createOptionValue.value).toBe(value);
    expect(createOptionValue.externalOptionValueId).toBe(externalOptionValueId);
    expect(createOptionValue.code).toBe(code);

    const optionValuesForOptionId = await resolvers.default.Query.optionValuesByOptionId(
      { user, application },
      {
        input: {
          optionId: createdOption.id
        }
      },
      { injector: OptionModule.injector }
    );
    expect(optionValuesForOptionId).toBeDefined();

    const loader = optionsLoader();
    const optionDetails = await resolvers.default.OptionValue.option(
      createOptionValue,
      {},
      {
        optionsLoader: loader,
        organizationId: user.organization.id
      }
    )

    expect(optionDetails).toBeDefined();
    expect(optionDetails.id).toBe(createdOption.id);
  });

  test("should update OptionValue", async () => {
    const manager = getManager();
    const optionInput = {
      name: "Test-name-984",
      description: chance.string({ length: 6 }),
      organizationId: user.organization.id
    };

    const createdOption = await optionService.createOption(
      manager,
      optionInput
    );

    const optionValueInput = {
      optionId: createdOption.id,
      value: "Large-1"
    };

    let application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      user.organization.id
    );

    const createOptionValue = await resolvers.default.Mutation.createOptionValue(
      { user, application },
      { input: optionValueInput },
      { injector: OptionModule.injector }
    );

    const updateOptionValueInput = {
      id: createOptionValue.id,
      optionId: createdOption.id,
      value: "Small-1",
      externalOptionValueId: "testOptionValueId12",
      code: "testOptionValueCode12"
    };

    const updateOptionValue = await resolvers.default.Mutation.updateOptionValue(
      { user, application },
      { input: updateOptionValueInput },
      { injector: OptionModule.injector }
    );

    expect(createOptionValue).toBeDefined();
    expect(createOptionValue.value).toBe("Large-1");
    expect(updateOptionValue).toBeDefined();
    expect(updateOptionValue.value).toBe("Small-1");
    expect(updateOptionValue.externalOptionValueId).toBe("testOptionValueId12");
    expect(updateOptionValue.code).toBe("testOptionValueCode12");
  });

  test("should update multiple OptionValues", async () => {
    const manager = getManager();
    const optionInput = {
      name: "Test-name-984",
      description: chance.string({ length: 6 }),
      organizationId: user.organization.id
    };

    const createdOption = await optionService.createOption(
      manager,
      optionInput
    );

    const optionValueInput1 = {
      optionId: createdOption.id,
      value: "Large-1"
    };

    const optionValueInput2 = {
      optionId: createdOption.id,
      value: "Large-1"
    };

    let application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      user.organization.id
    );

    const createOptionValue1 = await resolvers.default.Mutation.createOptionValue(
      { user, application },
      { input: optionValueInput1 },
      { injector: OptionModule.injector }
    );

    const createOptionValue2 = await resolvers.default.Mutation.createOptionValue(
      { user, application },
      { input: optionValueInput2 },
      { injector: OptionModule.injector }
    );

    const updateOptionValueInput = {
      optionId: createdOption.id,
      optionValueSeq: [
        {
          id: createOptionValue1.id,
          optionId: createdOption.id,
          value: "Small-1",
          externalOptionValueId: "testOptionValueId12",
          code: "testOptionValueCode12",
          sortSeq: chance.integer({ min: 0 })
        },
        {
          id: createOptionValue2.id,
          optionId: createdOption.id,
          sortSeq: chance.integer({ min: 0 })
        }
      ]
    };

    const updateOptionValue = await resolvers.default.Mutation.updateOptionValueSortSeq(
      { user, application },
      {
        input: updateOptionValueInput
      },
      { injector: OptionModule.injector }
    );

    expect(createOptionValue1).toBeDefined();
    expect(createOptionValue2).toBeDefined();
    expect(createOptionValue1.value).toBe(optionValueInput1.value);
    expect(createOptionValue2.value).toBe(optionValueInput2.value);
    expect(updateOptionValue).toBeDefined();
    expect(updateOptionValue.length).toBe(
      updateOptionValueInput.optionValueSeq.length
    );
    expect(updateOptionValue[0].sortSeq).toBe(
      updateOptionValueInput.optionValueSeq[0].sortSeq
    );
    expect(updateOptionValue[1].sortSeq).toBe(
      updateOptionValueInput.optionValueSeq[1].sortSeq
    );
  });

  test("should FAIL to update multiple OptionValues given invalid option value ids", async () => {
    const manager = getManager();
    const optionInput = {
      name: "Test-name-984",
      description: chance.string({ length: 6 }),
      organizationId: user.organization.id
    };

    const createdOption = await optionService.createOption(
      manager,
      optionInput
    );

    const optionValueInput1 = {
      optionId: createdOption.id,
      value: "Large-1"
    };

    const optionValueInput2 = {
      optionId: createdOption.id,
      value: "Large-1"
    };

    let application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      user.organization.id
    );

    const createOptionValue1 = await resolvers.default.Mutation.createOptionValue(
      { user, application },
      { input: optionValueInput1 },
      { injector: OptionModule.injector }
    );

    await resolvers.default.Mutation.createOptionValue(
      { user, application },
      { input: optionValueInput2 },
      { injector: OptionModule.injector }
    );

    const updateOptionValueInput = {
      optionId: createdOption.id,
      optionValueSeq: [
        {
          id: chance.integer({ min: 0 }),
          optionId: createdOption.id,
          value: "Small-1",
          externalOptionValueId: "testOptionValueId12",
          code: "testOptionValueCode12",
          sortSeq: chance.integer({ min: 0 })
        },
        {
          id: createOptionValue1.id,
          optionId: createdOption.id,
          sortSeq: chance.integer({ min: 0 })
        }
      ]
    };

    try {
      await resolvers.default.Mutation.updateOptionValueSortSeq(
        { user, application },
        {
          input: updateOptionValueInput
        },
        { injector: OptionModule.injector }
      );
    } catch (error) {
      const invalidOptionValueError = WCORE_ERRORS.OPTION_VALUE_NOT_FOUND;
      invalidOptionValueError.MESSAGE = `optionValue ${updateOptionValueInput.optionValueSeq[0].id} not found`;
      expect(error).toEqual(new WCoreError(invalidOptionValueError));
    }
  });

  test("should FAIL to update multiple OptionValues given invalid option details", async () => {
    const manager = getManager();
    let application = await applicationService.getApplicationByName(
      manager,
      "TEST_APPLICATION",
      user.organization.id
    );

    const optionInput = {
      name: "Test-name-984",
      description: chance.string({ length: 6 }),
      organizationId: user.organization.id
    };

    const createdOption = await optionService.createOption(
      manager,
      optionInput
    );

    const updateOptionValueInput = {
      optionId: createdOption.id,
      optionValueSeq: []
    };

    try {
      await resolvers.default.Mutation.updateOptionValueSortSeq(
        { user, application },
        {
          input: updateOptionValueInput
        },
        { injector: OptionModule.injector }
      );
    } catch (error) {
      expect(error).toEqual(
        new WCoreError(WCORE_ERRORS.OPTION_VALUE_DETAILS_EMPTY)
      );
    }
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
