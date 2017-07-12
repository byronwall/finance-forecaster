import * as React from "react";
import { Component } from "react";

import OutputTable from "./OutputTable";
import Chart from "./Chart";
import RecurringInputs from "./RecurringInputs";
import MortgageInputs from "./MortgageInputs";
import SavedStores from "./SavedStores";

import * as store from "store";

import { Grid, Row, Col, Navbar } from "react-bootstrap";

class App extends Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      loans: [
        { rate: 3.87, amount: 200000, term: 30, delay: 0, id: 1 }
      ],
      recurringAmounts: [
        { amount: 2000, frequency: 1, delay: 0, id: 1 },
        { amount: -800, frequency: 1, delay: 0, id: 2 }
      ],
      savedObj: this.getSavedObj()
    };

    // this is required i order to use this correct in the event handler
    this.handleMortgageChange = this.handleMortgageChange.bind(this);
    this.handleRecurringChange = this.handleRecurringChange.bind(this);
    this.handleStoreChange = this.handleStoreChange.bind(this);
  }

  getSavedObj() {
    return store.get("savedState") || [];
  }

  handleMortgageChange(obj: any) {
    console.log(obj);

    console.log("current state", this.state.loans);
    let newState = this.state.loans;

    if (obj.key === "add") {
      // this will add a new item
      const id = newState.reduce((acc: any, cur: any) => Math.max(acc, cur.id), 0);

      newState.push({ amount: 0, frequency: 1, delay: 0, id });

    } else if (obj.key === "remove") {
      // this will remove the given item
      newState = newState.filter((el: any) => {
        return el.id !== obj.id;
      });
    } else {
      newState[obj.id][obj.key] = obj[obj.key];
      console.log("new state", newState);
    }

    this.setState({ loans: newState });
  }

  handleRecurringChange(obj:any) {
    console.log("recurring", obj);

    console.log("current state", this.state.recurringAmounts);
    let newState = this.state.recurringAmounts;

    if (obj.key === "add") {
      const id = newState.reduce((acc:any, cur:any) => Math.max(acc, cur.id), 0) + 1;
      console.log("new id", id);
      newState.push({ amount: 0, frequency: 1, delay: 0, id });

    } else if (obj.key === "remove") {
      // this will remove the given item
      newState = newState.filter((el:any) => {
        return el.id !== obj.id;
      });
    } else {

      newState = newState.map((el:any) => {
        return (el.id === obj.id) ? { ...el, ...{ [obj.key]: obj[obj.key] } } : el;
      });

      console.log("new state", newState);
    }

    this.setState({ recurringAmounts: newState });
  }

  handleStoreChange(obj:any) {
    console.log("handleStoreChange", obj);

    console.log("current state", this.state.recurringAmounts);

    if (obj.key === "remove") {
      // this will remove the given item

      let savedObj = this.state.savedObj;

      savedObj = savedObj.filter((el:any) => {
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

      this.setState({ savedObj: savedObj })
      // put that object into a store
    } else if (obj.key === "load") {
      // iterate through the saved ones for the id
      console.log("loading the saved state");
      let matches = this.state.savedObj.filter((item:any) => item.name === obj.id);

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
            <Col md={5}>
              <MortgageInputs handleChange={this.handleMortgageChange} inputs={this.state.loans} />
              <RecurringInputs inputs={this.state.recurringAmounts} handleChange={this.handleRecurringChange} />
            </Col>
            <Col md={7}>
              <OutputTable
                moneyObj={this.state.income}
                mortgageObj={this.state.loans}
                recurringAmounts={this.state.recurringAmounts}
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
