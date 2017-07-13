import * as React from "react";
import { Component } from "react";
import { Table } from "react-bootstrap";

import { Account, CashFlow } from "../Models/Account";

interface OutputTableProps {
  accounts: Account[];
  activeAccount: number;
}

export default class OutputTable extends Component<OutputTableProps, any> {
  render() {

    let amounts = this.getCashFlows();

    return (
      <div>
        <h2>cash flows</h2>
        <Table striped={true} bordered={true} hover={true}>
          <thead>
            <tr>
              <th>month</th>
              <th>balance remaining</th>
            </tr>
          </thead>
          <tbody>
            {amounts.map((amount, index) => (
              <tr key={index}>
                <td>{amount.month}</td>
                <td>{amount.balance.toFixed(0)}</td>
              </tr>
            ))}

          </tbody>
        </Table>
      </div>
    );
  }

  getCashFlows(): CashFlow[] {

    let cashFlows: CashFlow[] = [];

    // get the account in question
    let matchinAccounts = this.props.accounts.filter((account, index) => (
      index === this.props.activeAccount
    ));

    // get the cash flows from that account
    for (let account of matchinAccounts) {
      cashFlows = account.getCashFlows(24, []);
    }

    return cashFlows;
  }
}
