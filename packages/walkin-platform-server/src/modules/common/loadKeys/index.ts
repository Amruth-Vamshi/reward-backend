const path = require("path");
const fs = require("fs");
var Base64 = require("js-base64").Base64;

export const loadTestKeys = () => {
  if (process.env.NODE_ENV !== "production") {
    console.log("🔐 Using development private key");
    const devPrivateKeyPath = path.join(
      __dirname,
      "private.development",
      "private.key"
    );
    const devPrivatePasswordKeyPath = path.join(
      __dirname,
      "private.development",
      "private.pem"
    );
    const privatePasswordKey = fs.readFileSync(
      devPrivatePasswordKeyPath,
      "utf8"
    );
    const privateKey = fs.readFileSync(devPrivateKeyPath, "utf8");
    process.env.PRIVATE_KEY = privateKey;
    process.env.PRIVATE_PASSWORD_RESET_KEY = privatePasswordKey;
    console.log("🔑 Using the development public key");
    const devPublicKeyPath = path.join(
      __dirname,
      "private.development",
      "public.key"
    );
    const devPublicPasswordKeyPath = path.join(
      __dirname,
      "private.development",
      "public.pem"
    );
    const publicPasswordKey = fs.readFileSync(devPublicPasswordKeyPath, "utf8");
    const publicKey = fs.readFileSync(devPublicKeyPath, "utf8");
    process.env.PUBLIC_KEY = publicKey;
    process.env.PUBLIC_PASSWORD_RESET_KEY = publicPasswordKey;
  } else {
    if (process.env.PRIVATE_KEY_BASE64 && process.env.PUBLIC_KEY_BASE64) {
      process.env.PRIVATE_KEY = Base64.decode(process.env.PRIVATE_KEY_BASE64);
      process.env.PUBLIC_KEY = Base64.decode(process.env.PUBLIC_KEY_BASE64);
      console.log("Using injected BASE64 of PRIVATE_KEY and PUBLIC_KEY");
    } else {
      console.log("Using injected PRIVATE_KEY and PUBLIC_KEY");
    }
    if (
      process.env.PRIVATE_PASSWORD_RESET_KEY_BASE64 &&
      process.env.PUBLIC_PASSWORD_RESET_KEY_BASE64
    ) {
      process.env.PRIVATE_PASSWORD_RESET_KEY = Base64.decode(
        process.env.PRIVATE_PASSWORD_RESET_KEY_BASE64
      );
      process.env.PUBLIC_PASSWORD_RESET_KEY = Base64.decode(
        process.env.PUBLIC_PASSWORD_RESET_KEY_BASE64
      );
      console.log(
        "Using injected BASE64 of PRIVATE_PASSWORD_RESET_KEY and PUBLIC_PASSWORD_RESET_KEY"
      );
    } else {
      console.log(
        "Using injected PRIVATE_PASSWORD_RESET_KEY and PUBLIC_PASSWORD_RESET_KEY"
      );
    }
  }
};
