import { normalize, schema, denormalize } from "normalizr";
import { Transfer, LoanAccount } from "./Account";
import { StateObj } from "../Components/App";

const transferSchema = new schema.Entity(
  "transfers",
  {},
  {
    processStrategy: (value: Transfer, parent, key) => {
      // this strategy will break the recursion
      // this is required because there is a circular reference between accounts/xfers
      return {
        ...value,
        toAccount:
          value.toAccount !== undefined ? value.toAccount.id : -1,
        fromAccount:
          value.fromAccount !== undefined ? value.fromAccount.id : -1
      };
    }
  }
);
const accountSchema = new schema.Entity("accounts", {
  transfers: [transferSchema]
});

const AppStateSchema = {
  accounts: [accountSchema],
  transfers: [transferSchema]
};

transferSchema.define({
  toAccount: accountSchema,
  fromAccount: accountSchema
});

export class DataSchema {
  static normalizeData(appState: StateObj | NormalizedEntities) {
    console.log("original", appState);

    const normalizedData = normalize(appState, AppStateSchema);

    console.log("norm", normalizedData);

    return normalizedData.entities as NormalizedEntities;
  }

  static denormalizeState(normEntities: NormalizedEntities) {
    const accounts = Object.keys(normEntities.accounts);
    const transfers = Object.keys(normEntities.transfers);

    const appStateDenorm = denormalize(
      { accounts, transfers },
      AppStateSchema,
      normEntities
    ) as StateObj;

    // apply the class to the accounts since they have methods
    appStateDenorm.accounts.forEach((account, index) => {
      appStateDenorm.accounts[index] = Object.setPrototypeOf(
        account,
        LoanAccount.prototype
      );
    });

    console.log("denorm app state", appStateDenorm);

    return appStateDenorm as StateObj;
  }
}

export interface NormalizedEntities {
  accounts: { [id: number]: LoanAccount };
  transfers: { [id: number]: Transfer };
}
