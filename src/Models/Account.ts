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

  constructor() {
    this.id = ++LoanAccount._id;
  }

  getCashFlows(months: number) {
    let cashFlowsOut = [];
    let prevBalance = this.startingBalance;

    let monthRate = (this.annualRate || 0) / 100 / 12;

    for (let month = 0; month < months; month++) {
      let monthPayments = 0;
      let curBalance = 0;
      let interest = 0;

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

export class LoanCashFlow {
  balance: number;
  payments: number;
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
