import * as React from 'react';
import { Component } from "react";
import { Panel } from "react-bootstrap";

export default class Chart extends Component {
  render() {
    return (
      <div>
        <Panel header="Chart">
          this will contain a chart of the cash flows
        </Panel>
      </div>
    );
  }
}
