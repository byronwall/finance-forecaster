import React, { Component } from "react";

import Inputs from "./Inputs";
import OutputTable from "./OutputTable";
import Chart from "./Chart";
import MortgageInput from "./MortgageInput";

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
      }
    };

    //this is required in order to use this correct in the event handler
    this.handleChange = this.handleChange.bind(this);
    this.handleMortgageChange = this.handleMortgageChange.bind(this);
  }

  handleChange(obj) {
    console.log(obj);
    this.setState({ income: obj.income });
  }

  handleMortgageChange(obj){
    console.log(obj);
    this.setState({mortgage: {...this.state.mortgage, ...obj}})
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
            </Col>
            <Col md={8}>
              <OutputTable moneyObj={this.state.income} />
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
