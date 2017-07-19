export abstract class Acct {
  static _id: number = 0;
  type: string;
  name: string;

  id: number;

  transfers: Transfer[] = [];

  abstract getCashFlows(months: number): CashFlow[];

  constructor() {
    this.id = ++Acct._id;
  }
}

export class LoanAccount extends Acct {
  type = "loan";
  name = "testing";

  term: number;
  annualRate: number;
  startingBalance: number;
  start: number;

  getCashFlows(months: number) {
    let cashFlowsOut = [];
    let prevBalance = this.startingBalance;

    let monthRate = this.annualRate / 100 / 12;

    for (let month = 0; month < months; month++) {
      let monthPayments = 0;
      let curBalance = 0;
      let interest = 0;

      if (this.start <= month) {
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

        curBalance = prevBalance + monthPayments;
        interest = monthRate * curBalance;

        curBalance += interest;

        prevBalance = curBalance;
      }

      let cashFlow = new LoanCashFlow();
      cashFlow.balance = curBalance;
      cashFlow.month = month;
      cashFlow.payments = monthPayments;
      cashFlow.interest = interest;

      cashFlowsOut.push(cashFlow);
    }

    return cashFlowsOut;
  }
}

export class CashAccount extends Acct {
  startAmount: number;

  type = "cash";
  name = "testing";

  getCashFlows(months: number) {
    let cashFlowsOut = [];
    let prevBalance = this.startAmount;

    for (let month = 0; month < months; month++) {
      let monthIncome = 0;
      // check the transfer to see if somethign affects it

      this.transfers.forEach(transfer => {
        if (
          (transfer.start <= month &&
            (month - transfer.start) % transfer.frequency === 0) ||
          (transfer.frequency === 0 && transfer.start === month)
        ) {
          if (transfer.toAccount === this) {
            monthIncome += transfer.amount;
          } else {
            monthIncome -= transfer.amount;
          }
        }
      });

      let curBalance = prevBalance + monthIncome;

      let cashFlow = new CashCashFlow();
      cashFlow.balance = curBalance;
      cashFlow.month = month;
      cashFlow.net = monthIncome;

      cashFlowsOut.push(cashFlow);

      prevBalance = curBalance;
    }

    return cashFlowsOut;
  }
}

export interface CashFlow {
  balance: number;
  month: number;
}

export class CashCashFlow implements CashFlow {
  balance: number;
  net: number;
  month: number;
}

export class LoanCashFlow implements CashFlow {
  balance: number;
  payments: number;
  month: number;
  interest: number;
}

export class Transfer {
  static _id: number = 0;

  fromAccount: Acct;
  toAccount: Acct;

  amount: number;
  frequency: number;
  start: number;
  end: number;

  id: number;

  constructor() {
    this.id = ++Transfer._id;
  }
}
