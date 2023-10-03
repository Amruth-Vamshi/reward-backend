import { ApolloError } from "apollo-server";
export class WCoreError extends ApolloError {
  public httpCode: number;
  constructor(WCORE_EXCEPTION_OBJECT: IWCoreException, PROPERTIES?: any) {
    super(
      WCORE_EXCEPTION_OBJECT.MESSAGE,
      WCORE_EXCEPTION_OBJECT.CODE,
      PROPERTIES
    );
    this.httpCode = WCORE_EXCEPTION_OBJECT.HTTP_CODE;
  }
}
interface IWCoreException {
  HTTP_CODE: number;
  MESSAGE: string;
  CODE: string;
}
