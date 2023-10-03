import Ajv = require("ajv");

const ajv = new Ajv({
  allErrors: true
});

export const validateJSONSchema = schema => {
  // if its string then convert to object first

  if (typeof schema === "string") {
    try {
      schema = JSON.parse(schema);
    } catch (err) {
      return {
        valid: false,
        message: "Invalid JSON"
      };
    }
  }

  // then try to validate by compiling
  try {
    const valid = ajv.validateSchema(schema);
    return {
      valid,
      message: ""
    };
  } catch (err) {
    return {
      valid: false,
      message: "Schema validation failed"
    };
  }
};

export const validateJSONDataUsingSchema = (schema, data) => {
  // if its string then convert to object first
  if (typeof schema === "string") {
    try {
      schema = JSON.parse(schema);
    } catch (err) {
      console.log(err);
      return {
        valid: false,
        message: "Invalid Data JSON"
      };
    }
  }

  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch (err) {
      console.log(err);
      return {
        valid: false,
        dataNotJsonFormat: true,
        message: "Invalid Schema JSON"
      };
    }
  }

  // then try to validate by compiling and then validate the data
  try {
    const validate = ajv.compile(schema);
    const valid = validate(data);
    if (!valid) {
      return {
        valid: false,
        message: ajv.errorsText(validate.errors)
      };
    }
    return {
      valid: true,
      message: ""
    };
  } catch (err) {
    console.log(err);
    return {
      valid: false,
      message: "Invalid Schema"
    };
  }
};
