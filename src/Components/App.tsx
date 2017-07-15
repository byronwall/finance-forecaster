import * as React from "react";
import { Component } from "react";

import {} from "./Chart";
import SavedStores from "./SavedStores";

import * as store from "store";

import { Grid, Row, Col, PageHeader } from "react-bootstrap";
import { CashAccount, LoanAccount, Account } from "../Models/Account";
import OutputTableContainer from "./OutputTableContainer";

class StateObj {
  accounts: Account[] = [];
}

class SavedState {
  name: string;
  data: StateObj;
}

class AppState extends StateObj {
  savedObj: SavedState[];
}

export class App extends Component<{}, AppState> {
  constructor(props: any) {
    super(props);

    let cashAcct = new CashAccount();
    cashAcct.name = "cash";
    cashAcct.startAmount = 500;

    let loanAcct = new LoanAccount();
    loanAcct.name = "loan";
    loanAcct.startingBalance = -300000;
    loanAcct.term = 30 * 12;
    loanAcct.annualRate = 3.87;

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

  handleAccountChange(obj: any, objIndex: number) {
    // this will be an account coming in

    console.log("account change", obj, objIndex);

    let newAccounts: any[] = [];

    this.state.accounts.forEach((account: any, index: number) => {
      if (objIndex === index) {
        newAccounts.push(obj);
      } else {
        newAccounts.push(account);
      }
    });

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

      let saveName = window.prompt("Enter a name for saving") as string;

      // put into a new object

      let saveData = { name: saveName, data: savedState };
      let savedObj = [...this.state.savedObj, saveData];

      store.set("savedState", savedObj);

      this.setState({ savedObj: savedObj });
      // put that object into a store
    } else if (obj.key === "load") {
      // iterate through the saved ones for the id
      console.log("loading the saved state");
      let matches = this.state.savedObj.filter(
        (item: any) => item.name === obj.id
      );

      console.log(matches);
      console.log({ ...matches[0].data });

      this.setState({ ...matches[0].data });

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
