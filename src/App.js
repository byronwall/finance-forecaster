import React, { Component } from "react";

import Inputs from "./Inputs";
import OutputTable from "./OutputTable";
import Chart from "./Chart";

import { Grid, Row, Col, Navbar } from "react-bootstrap";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = { value: 1000 };

    //this is required in order to use this correct in the event handler
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    console.log(e);
    this.setState({ value: e.target.value });
  }

  render() {
    return (
      <div>
        <Navbar>
          <Grid>
            <Navbar.Header>
              <Navbar.Brand>
                <a href="/">Finance Forecaster</a>
              </Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>
          </Grid>
        </Navbar>
        <Grid>
          <Row>
            <Col md={4}>
              <Inputs handleChange={this.handleChange} moneyObj={this.state} />
            </Col>
            <Col md={8}>
              <OutputTable moneyObj={this.state} />
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
