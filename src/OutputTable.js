import React, { Component } from "react";
import { Panel, Table } from "react-bootstrap";

export default class OutputTable extends Component {
  render() {
    
    let amounts = [];

    for (var i = 1; i <= 20; i++) {
      amounts.push(i * this.props.moneyObj);
    }

    return (
      <div>
        <Panel header="Output">

          <div>
            <p>this is a very rough table based on that value.. for testing</p>

            {//TODO put this Table into its own component
            }
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
                  <td>{this.props.moneyObj}</td>
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
