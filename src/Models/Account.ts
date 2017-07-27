import { StateObj } from "../Components/App";

export const enum AccountTypes {
  Cash,
  Loan
}

export class LoanAccount {
  static _id: number = 0;
  type: AccountTypes = AccountTypes.Loan;

  name: string;

  term: number;
  annualRate: number;
  startingBalance: number;
  start: number;

  transfers: Transfer[] = [];

  id: number;

  static getCashFlowsFromAccounts(
    accounts: LoanAccount[],
    rollUpPeriods: number = 24,
    rollUpFreq: number = 1
  ) {
    let cashFlows: LoanCashFlow[][] = [];

    accounts.forEach(account => {
      if (account.id > -1) {
        cashFlows.push(account.getCashFlows(rollUpPeriods, rollUpFreq));
      }
    });

    // combine the cash flows
    let combinedCashFlow: LoanCashFlow[] = [];

    cashFlows.forEach((cashFlow, index) => {
      if (index === 0) {
        // make a copy of the cash flows for the first time through
        combinedCashFlow = cashFlow.slice();
      } else {
        for (let month = 0; month < combinedCashFlow.length; month++) {
          combinedCashFlow[month].balance += cashFlow[month].balance;
        }
      }
    });

    return combinedCashFlow;
  }

  constructor() {
    this.id = ++LoanAccount._id;
  }

  getCashFlows(rollUpPeriods: number, rollUpFreq: number = 1) {
    let cashFlowsOut = [];
    let prevBalance = this.startingBalance;

    let monthRate = (this.annualRate || 0) / 100 / 12;

    // calculate the monthly amounts
    for (let rollUpPeriod = 0; rollUpPeriod < rollUpPeriods; rollUpPeriod++) {
      let rollupPayments = 0;
      let rollupInterest = 0;

      for (
        let month = rollUpFreq * rollUpPeriod;
        month < rollUpFreq * (rollUpPeriod + 1);
        month++
      ) {
        let monthPayments = 0;
        let endOfMonthBalance = 0;
        let monthInterest = 0;

        if ((this.start || 0) <= month) {
          this.transfers.forEach(transfer => {
            if (
              (transfer.start <= month &&
                (month - transfer.start) % transfer.frequency === 0) ||
              (transfer.frequency === 0 && transfer.start === month)
            ) {
              if (transfer.toAccount === this) {
                monthPayments += transfer.amount;
              } else {
                monthPayments -= transfer.amount;
              }
            }
          });

          endOfMonthBalance = prevBalance + monthPayments;
          monthInterest = monthRate * endOfMonthBalance;

          endOfMonthBalance += monthInterest;

          // accumulate the roll up quantities
          rollupPayments += monthPayments;
          rollupInterest += monthInterest;

          prevBalance = endOfMonthBalance;
        }
      }

      let cashFlow = new LoanCashFlow();
      cashFlow.balance = prevBalance;
      cashFlow.month = rollUpPeriod;
      cashFlow.payments = rollupPayments;
      cashFlow.interest = rollupInterest;

      cashFlowsOut.push(cashFlow);
    }

    // roll up the monthly amounts into a period

    //

    return cashFlowsOut;
  }
}

export class LoanCashFlow {
  balance: number;
  payments: number;
  // TODO: rename this from month since it can now vary
  month: number;
  interest: number;
}

export class Transfer {
  static _id: number = 0;

  fromAccount: LoanAccount;
  toAccount: LoanAccount;

  amount: number;
  frequency: number;
  start: number;
  end: number;

  id: number;

  constructor() {
    this.id = ++Transfer._id;
  }
}

export class SampleData {
  static getTypicalExample() {
    let cashAcct = new LoanAccount();
    cashAcct.name = "cash";
    cashAcct.type = AccountTypes.Cash;
    cashAcct.startingBalance = 500;

    let loanAcct = new LoanAccount();
    loanAcct.name = "loan";
    cashAcct.type = AccountTypes.Loan;
    loanAcct.startingBalance = -300000;
    loanAcct.term = 30 * 12;
    loanAcct.annualRate = 3.87;
    loanAcct.start = 0;

    let xfer = new Transfer();
    xfer.amount = 100;
    xfer.start = 6;
    xfer.frequency = 0;
    xfer.toAccount = loanAcct;
    xfer.fromAccount = cashAcct;

    cashAcct.transfers.push(xfer);
    //loanAcct.transfers.push(xfer);

    const accounts = [cashAcct, loanAcct];
    const transfers = [xfer];

    const appState = new StateObj();
    appState.accounts = accounts;
    appState.xfers = transfers;

    return appState;
  }
}
