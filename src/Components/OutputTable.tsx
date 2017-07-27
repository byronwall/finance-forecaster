import * as React from "react";
import { Component } from "react";
import { Table, FormControl } from "react-bootstrap";

import { LoanAccount } from "../Models/Account";

import {} from "./TransferGroup";

import { Chart } from "./Chart";

interface OutputTableProps {
  accounts: LoanAccount[];
}

interface OutputTableState {
  monthsToDisplay: number;
  rollUpFreq: number;
}

export class OutputTable extends Component<OutputTableProps, OutputTableState> {
  constructor(props: OutputTableProps) {
    super(props);

    this.state = {
      monthsToDisplay: 24,
      rollUpFreq: 1
    };
  }

  handleDisplayChange(months: number) {
    this.setState({ monthsToDisplay: months });
  }

  handleRollUpChange(rollUpFreq: number) {
    this.setState({ rollUpFreq });
  }

  render() {
    let amounts = LoanAccount.getCashFlowsFromAccounts(
      this.props.accounts,
      this.state.monthsToDisplay,
      this.state.rollUpFreq
    );

    console.log("amounts", amounts);

    return (
      <div>
        <h3>output table</h3>

        <div>
          <FormControl
            type="text"
            value={this.state.monthsToDisplay}
            onChange={(e: any) => this.handleDisplayChange(e.target.value)}
          />
          <FormControl
            type="text"
            value={this.state.rollUpFreq}
            onChange={(e: any) => this.handleRollUpChange(e.target.value)}
          />
        </div>

        <Chart data={amounts} />

        <Table striped={true} bordered={true} hover={true}>
          <thead>
            <tr>
              <th>month</th>
              <th>balance remaining</th>
              <th>net</th>
              <th>interest</th>
            </tr>
          </thead>
          <tbody>
            {amounts.map((amount, index) =>
              <tr key={index}>
                <td>
                  {amount.month}
                </td>
                <td>
                  {amount.balance.toFixed(0)}
                </td>
                <td>
                  {amount.payments.toFixed(0)}
                </td>
                <td>
                  {amount.interest.toFixed(0)}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    );
  }
}
