import React, { Component } from "react";
import { Panel, FormGroup, ControlLabel, FormControl, Table } from "react-bootstrap";

export default class Inputs extends Component {
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
    //compute the total amounts

    let amounts = [];

    for (var i = 1; i <= 10; i++) {
      amounts.push(i * this.state.value);
    }

    return (
      <div>
        <Panel header="Inputs">
          this is a single input for now

          <form>
            <FormGroup controlId="formBasicText">
              <ControlLabel>Enter a monthly income</ControlLabel>
              <FormControl
                type="text"
                value={this.state.value}
                placeholder="Enter text"
                onChange={this.handleChange}
              />

            </FormGroup>
          </form>

          <div>
            <p>this is a very rough table based on that value.. for testing</p>

            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>month</th>
                  <th>income</th>
                  <th>total income</th>
                </tr>
              </thead>
              {amounts.map((amount, index) => (
                <tr>
                  <td>{index}</td>
                  <td>{this.state.value}</td>
                  <td>{amount}</td>
                </tr>
              ))}

              <tbody />
            </Table>

          </div>

        </Panel>
      </div>
    );
  }
}
