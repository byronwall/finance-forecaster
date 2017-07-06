import React, { Component } from "react";

import Inputs from "./Inputs";
import OutputTable from "./OutputTable";
import Chart from "./Chart";
import MortgageInput from "./MortgageInput";
import RecurringInputs from "./RecurringInputs";

import { Grid, Row, Col, Navbar } from "react-bootstrap";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      income: 0,
      mortgage: {
        rate: 3.87,
        start: 200000,
        term: 30
      },
      recurringAmounts: [
        { amount: 2000, frequency: 1 },
        { amount: -800, frequency: 1 }
      ]
    };

    //this is required in order to use this correct in the event handler
    this.handleChange = this.handleChange.bind(this);
    this.handleMortgageChange = this.handleMortgageChange.bind(this);
    this.handleRecurringChange = this.handleRecurringChange.bind(this);
  }

  handleChange(obj) {
    console.log(obj);
    this.setState({ income: obj.income });
  }

  handleMortgageChange(obj) {
    console.log(obj);
    this.setState({ mortgage: { ...this.state.mortgage, ...obj } })
  }
  handleRecurringChange(obj) {
    console.log(obj);

    console.log("current state", this.state.recurringAmounts);
    let newState = this.state.recurringAmounts;

    newState[obj.id][obj.key] = obj[obj.key];
    console.log("new state", newState);

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
            <Col md={4}>
              <Inputs handleChange={this.handleChange} moneyObj={this.state.income} />
              <MortgageInput handleChange={this.handleMortgageChange} mortgageObj={this.state.mortgage} />
              <RecurringInputs inputs={this.state.recurringAmounts} handleChange={this.handleRecurringChange} />
            </Col>
            <Col md={8}>
              <OutputTable
                moneyObj={this.state.income}
                mortgageObj={this.state.mortgage}
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
