export interface Account {
  type: string;
  name: string;

  getCashFlows: (months: number) => CashFlow[];
}

export class LoanAccount implements Account {
  type = "loan";
  name = "testing";

  term: number;
  annualRate: number;
  startingBalance: number;
  start: number;

  transfers: Transfer[] = [];

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
            monthPayments += transfer.amount;
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

export class CashAccount implements Account {
  startAmount: number;

  type = "cash";
  name = "testing";

  transfers: Transfer[] = [];

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
          monthIncome += transfer.amount;
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
  fromAccount: number;
  toAccount: number;
  amount: number;
  frequency: number;
  start: number;
  end: number;
}
