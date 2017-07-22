import * as React from "react";
import { Component } from "react";
import { Table } from "react-bootstrap";

import { LoanAccount, LoanCashFlow } from "../Models/Account";

import {} from "./TransferGroup";
import {} from "../Helpers/Functions";
import { Chart } from "./Chart";

interface CombinedOutputTableProps {
  accounts: LoanAccount[];
}

export class CombinedOutputTable extends Component<CombinedOutputTableProps> {
  render() {
    // iterate all accounts, get the cash flows, combine the cash flows

    // TODO: take this code and put it somewhere common so it can be used elsewhere (for charting)
    let cashFlows: LoanCashFlow[][] = [];

    this.props.accounts.forEach(account => {
      if (account.id > -1) {
        cashFlows.push(account.getCashFlows(24));
      }
    });

    // combine the cash flows
    let combinedCashFlow: LoanCashFlow[] = [];

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
        <Chart data={combinedCashFlow} />
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
