import * as React from "react";
import { Component } from "react";
import { Table, FormControl } from "react-bootstrap";

import { Transfer, LoanAccount } from "../Models/Account";

import { TransferGroup } from "./TransferGroup";
import { handleInput } from "../Helpers/Functions";

interface LoanOutputTableProps {
  account: LoanAccount;
  index: number;
  handleAccountChange: (obj: any, index: number) => void;
}

export class LoanOutputTable extends Component<LoanOutputTableProps> {
  handleAccountChange(data: any) {
    for (let key of Object.keys(data)) {
      this.props.account[key] = data[key];
    }

    this.props.handleAccountChange(this.props.account, this.props.index);
  }

  handleNewTransfer(obj: Transfer) {
    // need to add this to the object and send it up the chain

    let { account } = this.props;

    account.transfers.push(obj);

    this.props.handleAccountChange(this.props.account, this.props.index);
  }

  render() {
    let amounts = this.props.account.getCashFlows(24);

    console.log("amounts", amounts);

    let inputColumns = [
      "name",
      "startingBalance",
      "term",
      "annualRate",
      "start"
    ];
    let funcs = [
      (input: string) => input,
      handleInput,
      handleInput,
      handleInput,
      handleInput
    ];

    return (
      <div>
        <h2>account details</h2>

        <h3>settings</h3>
        <form>
          <Table>
            <thead>
              <tr>
                {inputColumns.map((column, index) =>
                  <th key={index}>
                    {column}
                  </th>
                )}
              </tr>
            </thead>

            <tbody>
              <tr>
                {inputColumns.map((column, index) =>
                  <td key={index}>
                    <FormControl
                      type="text"
                      placeholder={column}
                      value={this.props.account[column]}
                      onChange={(e: any) =>
                        this.handleAccountChange({
                          [column]: funcs[index](e.target.value)
                        })}
                    />
                  </td>
                )}
              </tr>
            </tbody>
          </Table>
        </form>

        <TransferGroup
          transfers={this.props.account.transfers}
          handleNewTransfer={(obj: Transfer) => this.handleNewTransfer(obj)}
        />

        <h3>output table</h3>
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
