export interface Account {
  type: string;
  name: string;
}

export class LoanAccount implements Account {
  type = "loan";
  name = "testing";

  term: number;
  annualRate: number;
  startingBalance: number;

  transfers: Transfer[] = [];

  getCashFlows(months: number) {
    let cashFlowsOut = [];
    let prevBalance = this.startingBalance;

    let monthRate = this.annualRate / 100 / 12;

    for (let month = 0; month < months; month++) {
      let monthPayments = 0;
      // check the transfer to see if somethign affects it

      this.transfers.forEach(transfer => {
        if (
          (transfer.start <= month &&
            (month - transfer.start) % transfer.frequency === 0) ||
          (transfer.frequency === 0 && transfer.start === month)
        ) {
          monthPayments += transfer.amount;
        }
      });

      let curBalance = prevBalance + monthPayments;
      let interest = monthRate * curBalance;

      curBalance += interest;

      let cashFlow = new LoanCashFlow();
      cashFlow.balance = curBalance;
      cashFlow.month = month;
      cashFlow.payments = monthPayments;
      cashFlow.interest = interest;

      cashFlowsOut.push(cashFlow);

      prevBalance = curBalance;
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

export class CashCashFlow {
  balance: number;
  net: number;
  month: number;
}

export class LoanCashFlow {
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
