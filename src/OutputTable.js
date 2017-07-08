import React, { Component } from "react";
import { Panel, Table } from "react-bootstrap";

export default class OutputTable extends Component {
  render() {

    let amounts = this.calculateMortgage(this.props.mortgageObj[0]);
    let recurringAmounts = this.props.recurringAmounts;

    amounts = this.calculateRecurring(amounts, recurringAmounts);

    return (
      <div>
        <Panel header="Output">

          <div>

            {//TODO put this Table into its own component
            }
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>year</th>
                  <th>loan payment</th>
                  <th>interest amount</th>
                  <th>balance remaining</th>
                  <th>recurring</th>
                  <th>recurring running</th>
                </tr>
              </thead>
              <tbody>
                {amounts.map((amount, index) => (
                  <tr key={index}>
                    <td>{amount.year}</td>
                    <td>{amount.annualPayment.toFixed(0)}</td>
                    <td>{amount.interestMonth.toFixed(0)}</td>
                    <td>{amount.balance.toFixed(0)}</td>
                    <td>{amount.recurring.toFixed(0)}</td>
                    <td>{amount.recurringTotal.toFixed(0)}</td>
                  </tr>
                ))}

              </tbody>
            </Table>
          </div>
        </Panel>
      </div>
    );
  }

  calculateRecurring(amounts, recurringAmounts) {

    console.log("amounts incoming", amounts);
    let newAmounts = amounts;

    //the amounts will be year-indexed
    //recurring amounts is an array of {amount, freq} objects
    let recurringRunningTotal = 0;

    let totalIndex = 0;
    for (var year = 0; year < newAmounts.length; year++) {
      for (var month = 0; month < 12; month++) {

        for (var el_index = 0; el_index < recurringAmounts.length; el_index++) {
          let element = recurringAmounts[el_index];
          //if the freq is zero then add the amount
          if (totalIndex % element.frequency === 0 &&
            totalIndex >= element.delay
          ) {
            newAmounts[year].recurring += element.amount;

            recurringRunningTotal += element.amount;
          }

        }
        totalIndex++;
      }
      //console.log("end of year", recurringRunningTotal);
      newAmounts[year].recurringTotal = recurringRunningTotal;

      //console.log("result", year, newAmounts[year]);
    }

    return newAmounts;
  }

  calculateMortgage(mortgageObj) {

    const rate = mortgageObj.rate;
    const initial = mortgageObj.amount;
    const years = mortgageObj.term;
    const delay = mortgageObj.delay;

    const monthlyRatePct = rate / 1200;
    const monthlyPayment = monthlyRatePct === 0 ? initial / years / 12 :
      initial * monthlyRatePct / (1 - Math.pow(1 / (1 + monthlyRatePct), years * 12));

    let balance = initial;
    let payments = [];
    let totalMonths = 0;

    for (var year = 0; year < years; year++) {

      let annualInterest = 0;

      let annualPayment = 0;

      for (var month = 0; month < 12; month++) {
        //need to compute the remaining balance, interest, next month
        if (delay <= totalMonths) {
          let interestMonth = monthlyRatePct * balance;
          annualInterest += interestMonth;
          balance -= monthlyPayment - interestMonth;

          if (balance.toFixed(0) > 0) {
            annualPayment += monthlyPayment;
          }
        }
        totalMonths++;
      }

      payments.push({
        year: year,
        annualPayment,
        interestMonth: annualInterest,
        balance: balance,
        recurring: 0,
        recurringTotal: 0
      });

    }
    console.log("payments", payments);

    return payments;
  }
}
