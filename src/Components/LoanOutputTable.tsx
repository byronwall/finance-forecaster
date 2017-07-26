import * as React from "react";
import { Component } from "react";
import { Table, FormControl } from "react-bootstrap";

import { Transfer, LoanAccount } from "../Models/Account";

import { TransferGroup } from "./TransferGroup";
import { handleInput, $N } from "../Helpers/Functions";
import { Chart } from "./Chart";

interface LoanOutputTableProps {
  account: LoanAccount;
  accounts: LoanAccount[];
  handleAccountChange(obj: LoanAccount, shouldRemove?: boolean): void;
  handleTransferChange(obj: Transfer, shouldRemove?: boolean): void;
}

interface LoanOutputTableState {
  monthsToDisplay: number;
  rollUpFreq: number;
}

export class LoanOutputTable extends Component<
  LoanOutputTableProps,
  LoanOutputTableState
> {
  constructor(props: LoanOutputTableProps) {
    super(props);

    this.state = {
      monthsToDisplay: 24,
      rollUpFreq: 1
    };
  }

  handleAccountChange(data: any) {
    // TODO: really need to add a spread in here... figure out how to not destroy the class

    const newAccount = new LoanAccount();

    Object.assign(newAccount, this.props.account, data);

    this.props.handleAccountChange(newAccount);
  }

  handleTransferChange(obj: Transfer) {
    // this will get fired when the transfer ClickEditable is done editing

    // determine which transfer is changing, update that one attached to the current account

    // copy the current account
    const newAccount = new LoanAccount();
    Object.assign(newAccount, this.props.account);

    // iterate the transfers to find this one
    newAccount.transfers.forEach((transfer, index) => {
      if (transfer.id === obj.id) {
        newAccount.transfers[index] = obj;
      } else {
        // no change
      }
    });

    this.props.handleAccountChange(newAccount);

    // copy over the trasnfers except for the one that changed
  }

  handleNewTransfer(obj: Transfer) {
    // need to add this to the object and send it up the chain

    const newAccount = new LoanAccount();
    Object.assign(newAccount, this.props.account);

    newAccount.transfers.push(obj);

    this.props.handleAccountChange(this.props.account);
  }

  handleDisplayChange(months: number) {
    this.setState({ monthsToDisplay: months });
  }

  handleRollUpChange(rollUpFreq: number) {
    this.setState({ rollUpFreq });
  }

  render() {
    let amounts = this.props.account.getCashFlows(
      this.state.monthsToDisplay,
      this.state.rollUpFreq
    );

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
                      value={$N(this.props.account[column], "")}
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
          handleNewTransfer={xfer => this.props.handleTransferChange(xfer)}
          accounts={this.props.accounts}
          account={this.props.account}
          handleExistingTransferEdit={(xfer, shouldRemove) =>
            this.props.handleTransferChange(xfer, shouldRemove)}
        />

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

        <Chart data={amounts} />
      </div>
    );
  }
}
