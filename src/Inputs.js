import React, { Component } from "react";
import { Panel, FormGroup, ControlLabel, FormControl } from "react-bootstrap";

export default class Inputs extends Component {
  constructor(props) {
    super(props);

    //this is required in order to use this correct in the event handler
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e) {
    this.props.handleChange({ income: e.target.value });
  }

  render() {
    return (
      <div>
        <Panel header="Inputs">
          this is a single input for now

          <form>
            <FormGroup controlId="formBasicText">
              <ControlLabel>Enter a monthly income</ControlLabel>
              <FormControl
                type="text"
                value={this.props.moneyObj}
                placeholder="Enter text"
                onChange={this.handleChange}
              />

            </FormGroup>
          </form>
        </Panel>
      </div>
    );
  }
}
