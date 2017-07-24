import { normalize, schema, denormalize } from "normalizr";
import { Transfer, LoanAccount } from "./Account";
import { StateObj } from "../Components/App";

import * as _ from "lodash";

const transferSchema = new schema.Entity(
  "xfers",
  {},
  {
    processStrategy: (value: Transfer, parent, key) => {
      // this strategy will break the recursion
      // this is required because there is a circular reference between accounts/xfers
      console.log("process xfer", value, parent, key);

      switch (key) {
        case "transfers":
          return {
            ...value,
            toAccount: value.toAccount !== undefined ? value.toAccount.id : -1,
            fromAccount:
              value.fromAccount !== undefined ? value.fromAccount.id : -1
          };
        default:
          return { ...value };
      }
    }
  }
);
const accountSchema = new schema.Entity(
  "accounts",
  {
    transfers: [transferSchema]
  },
  {
    processStrategy: (value, parent, key) => {
      console.log("process acct", value, parent, key);
      switch (key) {
        case "toAccount":
        case "fromAccount":
          return { ...value, transfers: [parent.id] };
        default:
          return { ...value };
      }
    },
    mergeStrategy: (itemA, itemB) => {
      console.log("merge acct", itemA, itemB);

      return {
        ...itemA,
        ...itemB,
        transfers: _.uniq([...itemA.transfers, ...itemB.transfers])
      };
    }
  }
);

const AppStateSchema = {
  xfers: [transferSchema],
  accounts: [accountSchema]
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
    console.log("norm state incoming", normEntities);

    const accounts =
      normEntities.accounts !== undefined
        ? Object.keys(normEntities.accounts)
        : [];
    const xfers =
      normEntities.xfers !== undefined ? Object.keys(normEntities.xfers) : [];

    const appStateDenorm = denormalize(
      { accounts, xfers },
      AppStateSchema,
      normEntities
    ) as StateObj;

    // apply the class to the accounts since they have methods
    appStateDenorm.accounts.forEach((account, index) => {
      appStateDenorm.accounts[index] = Object.setPrototypeOf(
        account,
        LoanAccount.prototype
      );

      // remove undefined transfers that might linger past an update
      account.transfers = account.transfers.filter(xfer => xfer !== undefined);
    });

    console.log("denorm app state", appStateDenorm);

    return appStateDenorm as StateObj;
  }
}

export interface NormalizedEntities {
  accounts: { [id: number]: LoanAccount };
  xfers: { [id: number]: Transfer };
}
