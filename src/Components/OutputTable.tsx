import * as React from "react";
import { Component } from "react";
import {
  Table,
  FormControl,
  Form,
  FormGroup,
  Col,
  ControlLabel
} from "react-bootstrap";

import { LoanAccount, LoanCashFlow } from "../Models/Account";

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
      monthsToDisplay: 40,
      rollUpFreq: 12
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

    // calculate the overall properties too
    const presentValue = LoanCashFlow.getPresentValueOfCashFlows(amounts, 3);

    console.log("amounts", amounts);

    return (
      <div>
        <h3>output table</h3>

        <div>
          <Form inline={true}>
            <FormGroup>
              <Col componentClass={ControlLabel} md={6}>
                Periods to display
              </Col>
              <Col md={5}>
                <FormControl
                  type="text"
                  value={this.state.monthsToDisplay}
                  onChange={(e: any) =>
                    this.handleDisplayChange(e.target.value)}
                />
              </Col>
            </FormGroup>

            <FormGroup>
              <Col componentClass={ControlLabel} md={6}>
                Rollup period (months)
              </Col>
              <Col md={5}>
                <FormControl
                  type="text"
                  value={this.state.rollUpFreq}
                  onChange={(e: any) => this.handleRollUpChange(e.target.value)}
                />
              </Col>
            </FormGroup>
          </Form>
        </div>

        <div>
          <h4>overall data</h4>
          <p>
            {"present value = " + presentValue.toFixed(2)}
          </p>
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
