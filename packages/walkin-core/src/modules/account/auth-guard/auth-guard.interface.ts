import { User, Application, APIKey } from "../../../entity";

export interface IAuthResolverArgs {
  user?: User;
  application?: Application;
  apiKey?: APIKey;
  jwt?: string;
}
