import * as React from "react";
import { Component } from "react";
import { Table, FormControl } from "react-bootstrap";

import { CashAccount, CashCashFlow } from "../Models/Account";

interface CashOutputTableProps {
  account: CashAccount;
  cashFlow: CashCashFlow[];
  index: number;
  handleAccountChange: (obj: any, index: number) => void;
}

export class CashOutputTable extends Component<CashOutputTableProps, any> {

  handleAccountChange(data: any) {

    for (let key of Object.keys(data)) {

      // TODO: really need to get rid of this
      if (key == "startAmount" || key == "totalIncome") {
        data[key] = Number.parseFloat(data[key]);
      }

      this.props.account[key] = data[key];
    }

    console.log(this.props.account);

    this.props.handleAccountChange(this.props.account, this.props.index);
  }

  render() {

    let amounts = this.props.cashFlow;

    console.log("amounts", amounts);

    return (
      <div>
        <h2>account details</h2>

        <h3>settings</h3>
        <form>

          <Table>
            <thead>
              <tr>
                <th>name</th>
                <th>start amount</th>
                <th>total income</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>
                  <FormControl
                    type="text"
                    placeholder="name"
                    value={this.props.account.name}
                    onChange={(e: any) => this.handleAccountChange({ name: e.target.value })}
                  />
                </td>
                <td>
                  <FormControl
                    type="text"
                    placeholder="start amount"
                    value={this.props.account.startAmount}
                    onChange={(e: any) => this.handleAccountChange({ startAmount: e.target.value })}
                  />
                </td>
                <td>
                  <FormControl
                    type="text"
                    placeholder="total income"
                    value={this.props.account.totalIncome}
                    onChange={(e: any) => this.handleAccountChange({ totalIncome: e.target.value })}
                  />
                </td>
              </tr>
            </tbody>

          </Table>

        </form>

        <h3>output table</h3>
        <Table striped={true} bordered={true} hover={true}>
          <thead>
            <tr>
              <th>month</th>
              <th>balance remaining</th>
              <th>net</th>
            </tr>
          </thead>
          <tbody>
            {amounts.map((amount, index) => (
              <tr key={index}>
                <td>{amount.month}</td>
                <td>{amount.balance.toFixed(0)}</td>
                <td>{amount.net.toFixed(0)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  }
}
