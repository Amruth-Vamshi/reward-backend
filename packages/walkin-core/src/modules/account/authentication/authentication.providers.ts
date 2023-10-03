import { Injectable } from "@graphql-modules/di";
import jwt, { SignOptions } from "jsonwebtoken";
import passport from "passport";
import { promisify } from "util";
import { WalkinError } from "../../common/exceptions/walkin-platform-error";
import { getAPIOptions, getJWTOptions } from "../../common/utils/utils";
import { WCoreError } from "../../common/exceptions";
import { WCORE_ERRORS } from "../../common/constants/errors";
import { LoginInput } from "../../../graphql/generated-models";
import { User } from "../../../entity";
import bcrypt from "bcryptjs";
import { getManager } from "typeorm";

interface ILoginInput {
  email?: string;
  password: string;
  userName?: string;
}

@Injectable()
export class AuthenticationProvider {
  public async logout(req, res) {
    return req.logout();
  }

  public async login(input: ILoginInput) {
    const entityManager = getManager();
    const privateKey = process.env.PRIVATE_KEY;
    const { email, password, userName } = input;
    if (userName && email) {
      throw new WCoreError(WCORE_ERRORS.INVALID_LOGIN_INPUT);
    }

    const selectFields = [
      "user.id",
      "user.password",
      "user.emailConfirmed",
      "organization.id",
      "organization.externalOrganizationId"
    ];

    let user;
    if (email) {
      user = await entityManager
        .getRepository(User)
        .createQueryBuilder("user")
        .leftJoin("user.organization", "organization")
        .select(selectFields)
        .where("user.email =:email", { email })
        .getOne();
    }
    if (userName) {
      user = await entityManager
        .getRepository(User)
        .createQueryBuilder("user")
        .leftJoin("user.organization", "organization")
        .select(selectFields)
        .where("user.userName =:userName", { userName })
        .getOne();
    }

    if (!user) {
      throw new WCoreError(WCORE_ERRORS.USER_NOT_FOUND);
    }
    const match = await this.comparePassword(password, user.password);
    if (!match) {
      throw new WCoreError(WCORE_ERRORS.USER_PASSWORD_DOES_NOT_MATCH);
    }
    if (!user.emailConfirmed) {
      throw new WCoreError(WCORE_ERRORS.USER_EMAIL_NOT_VERIFIED);
    }
    const payload = {
      id: user.id,
      org_id: user.organization ? user.organization.id : null,
      external_org_id: user.organization
        ? user.organization.externalOrganizationId
        : null
    };
    const signOptions: SignOptions = getJWTOptions();
    const token = jwt.sign(payload, privateKey, signOptions);
    return {
      jwt: token
    };
  }

  public async refreshToken(oldJWT) {
    const privateKey = process.env.PRIVATE_KEY;
    const signOptions = getAPIOptions();
    const publicKey = process.env.PUBLIC_KEY;
    const verified = jwt.verify(oldJWT, publicKey);
    if (!verified) {
      throw new WalkinError("Token invalid");
    }
    const { id, org_id, external_org_id } = jwt.decode(oldJWT) as any;
    const payload = {
      id,
      org_id,
      external_org_id
    };
    const token = jwt.sign(payload, privateKey, signOptions);
    return {
      jwt: token
    };
  }

  private comparePassword(inputPass, dbPass) {
    return bcrypt.compare(inputPass, dbPass);
  }
}
