import { normalize, schema, denormalize } from "normalizr";
import { Transfer, LoanAccount } from "./Account";
import { StateObj } from "../Components/App";

const transferSchema = new schema.Entity(
  "transfers",
  {},
  {
    processStrategy: (value: Transfer, parent, key) => {
      // this strategy will break the recursion
      return {
        ...value,
        toAccount: value.toAccount.id,
        fromAccount: value.fromAccount.id
      };
    }
  }
);
const accountSchema = new schema.Entity("accounts", {
  transfers: [transferSchema]
});
const accountsSchema = [accountSchema];

transferSchema.define({
  toAccount: accountSchema,
  fromAccount: accountSchema
});

export class DataSchema {
  static normalizeData(accounts: LoanAccount[]) {
    console.log("original", accounts);

    const normalizedData = normalize(accounts, accountsSchema);

    console.log("norm", normalizedData);

    return normalizedData;
  }
  static denormalizeAccounts(normalizedData: any) {
    const denormal = denormalize(
      normalizedData.result,
      accountsSchema,
      normalizedData.entities
    );

    console.log("denom1", denormal);

    const newState = StateObj.FromJson({ accounts: denormal });

    console.log("w/ const", newState);
  }
}
