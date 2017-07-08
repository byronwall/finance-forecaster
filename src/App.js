import React, { Component } from "react";

import OutputTable from "./OutputTable";
import Chart from "./Chart";
import RecurringInputs from "./RecurringInputs";
import MortgageInputs from "./MortgageInputs";

import { Grid, Row, Col, Navbar } from "react-bootstrap";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loans: [
        { rate: 3.87, amount: 200000, term: 30, delay: 0, id: 1 }
      ],
      recurringAmounts: [
        { amount: 2000, frequency: 1, delay: 0, id: 1 },
        { amount: -800, frequency: 1, delay: 0, id: 2 }
      ]
    };

    //this is required i order to use this correct in the event handler
    this.handleMortgageChange = this.handleMortgageChange.bind(this);
    this.handleRecurringChange = this.handleRecurringChange.bind(this);
  }

  handleMortgageChange(obj) {
    console.log(obj);

    console.log("current state", this.state.loans);
    let newState = this.state.loans;

    if (obj.key === "add") {
      //this will add a new item
      const id = newState.reduce((acc, cur) => Math.max(acc, cur.id), 0);

      newState.push({ amount: 0, frequency: 1, delay: 0, id });

    } else if (obj.key === "remove") {
      //this will remove the given item
      newState = newState.filter((el) => {
        return el.id !== obj.id;
      });
    }
    else {
      newState[obj.id][obj.key] = obj[obj.key];
      console.log("new state", newState);
    }

    this.setState({ loans: newState });
  }

  handleRecurringChange(obj) {
    console.log("recurring", obj);

    console.log("current state", this.state.recurringAmounts);
    let newState = this.state.recurringAmounts;

    if (obj.key === "add") {
      const id = newState.reduce((acc, cur) => Math.max(acc, cur.id), 0) + 1;
      console.log("new id", id);
      newState.push({ amount: 0, frequency: 1, delay: 0, id });

    } else if (obj.key === "remove") {
      //this will remove the given item
      newState = newState.filter((el) => {
        return el.id !== obj.id;
      });
    } else {

      newState = newState.map((el) => {
        return (el.id === obj.id) ? { ...el, ...{ [obj.key]: obj[obj.key] } } : el;
      });

      console.log("new state", newState);
    }

    this.setState({ recurringAmounts: newState });
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
