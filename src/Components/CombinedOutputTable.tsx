import * as React from "react";
import { Component } from "react";
import { Table } from "react-bootstrap";

import { Acct, CashFlow } from "../Models/Account";

import {} from "./TransferGroup";
import {} from "../Helpers/Functions";

interface CombinedOutputTableProps {
  accounts: Acct[];
}

export class CombinedOutputTable extends Component<CombinedOutputTableProps> {
  render() {
    // iterate all accounts, get the cash flows, combine the cash flows

    // TODO: take this code and put it somewhere common so it can be used elsewhere (for charting)
    let cashFlows: CashFlow[][] = [];

    this.props.accounts.forEach(account => {
      cashFlows.push(account.getCashFlows(24));
    });

    // combine the cash flows
    let combinedCashFlow: CashFlow[] = [];

    cashFlows.forEach((cashFlow, index) => {
      if (index === 0) {
        combinedCashFlow = cashFlow.slice();
      } else {
        for (let month = 0; month < combinedCashFlow.length; month++) {
          combinedCashFlow[month].balance += cashFlow[month].balance;
        }
      }
    });

    return (
      <div>
        <h3>combined table</h3>
        <Table striped={true} bordered={true} hover={true}>
          <thead>
            <tr>
              <th>month</th>
              <th>balance</th>
            </tr>
          </thead>
          <tbody>
            {combinedCashFlow.map((amount, index) =>
              <tr key={index}>
                <td>
                  {amount.month}
                </td>
                <td>
                  {amount.balance.toFixed(0)}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    );
  }
}
