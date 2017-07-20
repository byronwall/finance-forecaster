import * as React from "react";
import { Component } from "react";
import { Table, FormControl } from "react-bootstrap";

import { Transfer, LoanAccount } from "../Models/Account";

import { TransferGroup } from "./TransferGroup";
import { handleInput, $N } from "../Helpers/Functions";

interface LoanOutputTableProps {
  account: LoanAccount;
  accounts: LoanAccount[];
  handleAccountChange(obj: LoanAccount, shouldRemove?: boolean): void;
}

export class LoanOutputTable extends Component<LoanOutputTableProps> {
  handleAccountChange(data: any) {
    // TODO: really need to add a spread in here... figure out how to not destroy the class

    const newAccount = new LoanAccount();

    Object.assign(newAccount, this.props.account, data);

    this.props.handleAccountChange(newAccount);
  }

  handleNewTransfer(obj: Transfer) {
    // need to add this to the object and send it up the chain

    const newAccount = new LoanAccount();
    Object.assign(newAccount, this.props.account);

    newAccount.transfers.push(obj);

    this.props.handleAccountChange(this.props.account);
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
          handleNewTransfer={(obj: Transfer) => this.handleNewTransfer(obj)}
          accounts={this.props.accounts}
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
