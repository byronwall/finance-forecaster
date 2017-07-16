import * as React from "react";
import { Component } from "react";

import {} from "./Chart";
import SavedStores from "./SavedStores";

import * as store from "store";

import { Grid, Row, Col, PageHeader } from "react-bootstrap";
import { CashAccount, LoanAccount, Account } from "../Models/Account";
import OutputTableContainer from "./OutputTableContainer";

import * as CryptoJS from "crypto-js";

class StateObj {
  accounts: Account[] = [];

  static FromJson(data: StateObj): StateObj {
    let stateObj = new StateObj();

    // handle accounts
    data.accounts.forEach(account => {
      if (account.type === "cash") {
        let newAccount = new CashAccount();
        Object.assign(newAccount, account);

        stateObj.accounts.push(newAccount);
      } else if (account.type === "loan") {
        let newAccount = new LoanAccount();
        Object.assign(newAccount, account);

        stateObj.accounts.push(newAccount);
      }
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

  render() {
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
