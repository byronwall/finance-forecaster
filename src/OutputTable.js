import React, { Component } from "react";
import { Panel, Table } from "react-bootstrap";

export default class OutputTable extends Component {
  render() {

    let amounts = this.calculateMortgage(this.props.mortgageObj);

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
                  <th>interest amount</th>
                  <th>balance remaining</th>
                </tr>
              </thead>
              {amounts.map((amount, index) => (
                <tr>
                  <td>{amount.month}</td>
                  <td>{amount.interestMonth.toFixed(2)}</td>
                  <td>{amount.balance.toFixed(2)}</td>
                </tr>
              ))}

              <tbody />
            </Table>

          </div>

        </Panel>
      </div>
    );
  }
  calculateMortgage(mortgageObj) {

    const rate = mortgageObj.rate;
    const initial = mortgageObj.start;
    const years = mortgageObj.term;

    const monthlyRatePct = rate / 1200;
    const monthlyPayment = monthlyRatePct === 0 ? initial / years / 12 :
      initial * monthlyRatePct / (1 - Math.pow(1 / (1 + monthlyRatePct), years * 12));

    let balance = initial;

    let payments = [];

    for (var month = 0; month < years * 12; month++) {
      //need to compute the remaining balance, interest, next month
      let interestMonth = monthlyRatePct * balance;

      balance -= monthlyPayment - interestMonth;

      payments.push({
        month: month,
        interestMonth: interestMonth,
        balance: balance
      });

    }
    console.log(payments);

    return payments;

  }
}
