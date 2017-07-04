import React, { Component } from "react";

import Inputs from "./Inputs";
import OutputTable from "./OutputTable";
import Chart from "./Chart";

import { Grid, Row, Col, Navbar } from "react-bootstrap";

class App extends Component {
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
              <Inputs />
            </Col>
            <Col md={8}>
              <OutputTable />
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
