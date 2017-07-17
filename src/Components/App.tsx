import * as React from "react";
import { Component } from "react";

import {} from "./Chart";
import SavedStores from "./SavedStores";

import * as store from "store";

import { Grid, Row, Col, PageHeader } from "react-bootstrap";
import { CashAccount, LoanAccount, Account, Transfer } from "../Models/Account";
import OutputTableContainer from "./OutputTableContainer";

import * as CryptoJS from "crypto-js";

import { normalize, schema, denormalize } from "normalizr";

const denormalizr = require("denormalizr");

class StateObj {
  accounts: Account[] = [];

  static FromJson(data: StateObj): StateObj {
    let stateObj = new StateObj();

    // handle accounts
    data.accounts.forEach(account => {
      let newAccount: Account = {} as Account;
      if (account.type === "cash") {
        newAccount = new CashAccount();
        Object.assign(newAccount, account);

        stateObj.accounts.push(newAccount);
      } else if (account.type === "loan") {
        newAccount = new LoanAccount();
        Object.assign(newAccount, account);

        stateObj.accounts.push(newAccount);
      }

      let newTransfers: Transfer[] = [];

      newAccount.transfers.forEach(transfer => {
        let newTransfer = new Transfer();
        newTransfer = Object.assign(newTransfer, transfer);

        newTransfers.push(newTransfer);
      });

      newAccount.transfers = newTransfers;
    });

    return stateObj;
  }
}

class SavedState {
  name: string;
  data: StateObj;
  encryptedData: CryptoJS.WordArray | string;
  encrytedCheck: CryptoJS.WordArray | string;
}

class AppState extends StateObj {
  savedObj: SavedState[];
}

export class App extends Component<{}, AppState> {
  constructor(props: {}) {
    super(props);

    let cashAcct = new CashAccount();
    cashAcct.name = "cash";
    cashAcct.startAmount = 500;

    let loanAcct = new LoanAccount();
    loanAcct.name = "loan";
    loanAcct.startingBalance = -300000;
    loanAcct.term = 30 * 12;
    loanAcct.annualRate = 3.87;
    loanAcct.start = 0;

    let xfer = new Transfer();
    xfer.amount = 100;
    xfer.start = 0;
    xfer.frequency = 1;
    xfer.toAccount = loanAcct;
    xfer.fromAccount = cashAcct;

    cashAcct.transfers.push(xfer);
    loanAcct.transfers.push(xfer);

    this.state = {
      accounts: [cashAcct, loanAcct],
      savedObj: this.getSavedObj()
    };

    this.handleStoreChange = this.handleStoreChange.bind(this);
    this.handleAccountChange = this.handleAccountChange.bind(this);
  }

  getSavedObj() {
    return store.get("savedState") || [];
  }

  handleAccountChange(
    obj: Account,
    objIndex: number,
    shouldRemove: boolean = false
  ) {
    // this will be an account coming in

    console.log("account change", obj, objIndex, shouldRemove);

    let newAccounts: Account[] = [];

    this.state.accounts.forEach((account, index) => {
      if (objIndex === index) {
        if (!shouldRemove) {
          newAccounts.push(obj);
        }
      } else {
        newAccounts.push(account);
      }
    });

    if (objIndex === -1) {
      newAccounts.push(obj);
    }

    this.setState({ accounts: newAccounts });
  }

  handleStoreChange(obj: any) {
    console.log("handleStoreChange", obj);

    if (obj.key === "remove") {
      // this will remove the given item

      let savedObj = this.state.savedObj;

      savedObj = savedObj.filter((el: any) => {
        return el.name !== obj.id;
      });

      console.log("new savedObj", savedObj);

      this.setState({ savedObj });
      store.set("savedState", savedObj);
    } else if (obj.key === "save") {
      console.log("saving the state");

      // take the current state (excluding the saved state obj)
      let savedState = new StateObj();
      for (let key of Object.keys(savedState)) {
        savedState[key] = this.state[key];
      }

      let saveName = window.prompt("Enter a name for saving") || "";

      let saveData = new SavedState();
      saveData.name = saveName;

      let passphrase =
        window.prompt("Enter a passphrase or blank for no encryption") || "";

      let isEncrypted = passphrase !== "";

      if (isEncrypted) {
        const encryptedData = CryptoJS.AES.encrypt(
          JSON.stringify(savedState),
          passphrase
        );

        const encryptedCheck = CryptoJS.AES.encrypt("true", passphrase);

        saveData.encryptedData = encryptedData.toString();
        saveData.encrytedCheck = encryptedCheck.toString();
      } else {
        saveData.data = savedState;
      }

      console.log("save data", saveData);

      // add to existing objects
      let savedObj = [...this.state.savedObj, saveData];

      store.set("savedState", savedObj);

      this.setState({ savedObj: savedObj });
      // put that object into a store
    } else if (obj.key === "load") {
      // iterate through the saved ones for the id
      console.log("loading the saved state");
      let stateToLoad = this.state.savedObj.find(
        item => item.name === obj.id
      ) as SavedState;

      // check for encryption

      let shouldLoad = true;

      if (stateToLoad.encryptedData !== "") {
        const passphrase = window.prompt("Please enter the passphrase") || "";

        // check is passphrase is OK
        const encryptedCheck = CryptoJS.AES
          .decrypt(stateToLoad.encrytedCheck, passphrase)
          .toString(CryptoJS.enc.Utf8);

        if (encryptedCheck === "true") {
          stateToLoad.data = JSON.parse(
            CryptoJS.AES
              .decrypt(stateToLoad.encryptedData, passphrase)
              .toString(CryptoJS.enc.Utf8)
          );
        } else {
          shouldLoad = false;
          alert("passphrase was wrong... will not load");
        }
      }

      if (shouldLoad) {
        stateToLoad.data = StateObj.FromJson(stateToLoad.data);
        this.setState({ ...stateToLoad.data });
      }

      // push that data into the current state
    }
  }

  componentDidMount() {
    console.log("mounted");
  }

  render() {
    const transferSchema = new schema.Entity(
      "transfer",
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

    const normalizedData = normalize(this.state.accounts, accountsSchema);

    console.log("original", this.state.accounts);
    console.log("norm", normalizedData);

    const denormal = denormalize(
      normalizedData.result,
      accountsSchema,
      normalizedData.entities
    );

    const denormal2 = denormalizr.denormalize(
      normalizedData.result,
      normalizedData.entities,
      accountsSchema
    );

    console.log("denom1", denormal);
    console.log("denom2", denormal2);

    console.log(
      "ref test",
      denormal[1]["transfers"][0]["fromAccount"] === denormal[0]
    );

    console.log(
      "ref test2",
      denormal2[1]["transfers"][0]["fromAccount"] === denormal2[0]
    );

    const newState = StateObj.FromJson({ accounts: denormal });

    console.log("w/ const", newState);

    return (
      <div>
        <Grid>
          <Row>
            <PageHeader>Finance Forecaster</PageHeader>
          </Row>
          <Row>
            <Col md={12}>
              <SavedStores
                inputs={this.state.savedObj}
                handleChange={this.handleStoreChange}
              />
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <OutputTableContainer
                accounts={this.state.accounts}
                handleAccountChange={this.handleAccountChange}
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}
