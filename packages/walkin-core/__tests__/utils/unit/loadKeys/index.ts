import path = require("path");
import fs = require("fs");

export const loadTestKeys = () => {
  if (process.env.NODE_ENV !== "production") {
    // console.log("🔐 Using development private key");
    const devPrivateKeyPath = path.join(
      __dirname,
      "private.development",
      "private.key"
    );
    const privateKey = fs.readFileSync(devPrivateKeyPath, "utf8");
    process.env.PRIVATE_KEY = privateKey;
    // console.log("🔑 Using the development public key");
    const devPublicKeyPath = path.join(
      __dirname,
      "private.development",
      "public.key"
    );
    const publicKey = fs.readFileSync(devPublicKeyPath, "utf8");
    process.env.PUBLIC_KEY = publicKey;
  } else {
    // console.log("Using injected PRIVATE_KEY and PUBLIC_KEY");
  }
};

export const unloadTestKeys = () => {
  delete process.env.PRIVATE_KEY;
  delete process.env.PUBLIC_KEY;
};
