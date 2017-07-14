import * as React from "react";
import { Component } from "react";


import Chart from "./Chart";
import SavedStores from "./SavedStores";

import * as store from "store";

import { Grid, Row, Col, Navbar } from "react-bootstrap";
import { CashAccount } from "../Models/Account";
import OutputTableContainer from "./OutputTableContainer";

class App extends Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      accounts: [
        new CashAccount(0, 100),
        new CashAccount(0, 200)
      ],
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

    console.log("current state", this.state.recurringAmounts);

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
      let savedState = { ...this.state };
      delete savedState.savedObj;

      let saveName = window.prompt("Enter a name for saving");

      // put into a new object

      let saveData = { name: saveName, data: savedState };
      let savedObj = [...this.state.savedObj, saveData];

      store.set("savedState", savedObj);

      this.setState({ savedObj: savedObj });
      // put that object into a store
    } else if (obj.key === "load") {
      // iterate through the saved ones for the id
      console.log("loading the saved state");
      let matches = this.state.savedObj.filter((item: any) => item.name === obj.id);

      console.log(matches);
      console.log({ ...matches[0].data });

      this.setState({ ...matches[0].data });

      // push that data into the current state
    }
  }

  render() {
    return (
      <div>
        <Navbar>
          <Grid>
            <Navbar.Header>
              <Navbar.Brand>
                <p>Finance Forecaster</p>
              </Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>
          </Grid>
        </Navbar>
        <Grid>
          <Row >
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
          <Chart />
          <Row />
        </Grid>
      </div>
    );
  }
}

export default App;
