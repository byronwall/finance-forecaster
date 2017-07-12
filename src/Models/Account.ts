export interface Account {
    getCashFlows: (transfer: Transfer[], months: number) => CashFlow[];
}

export class LoanAccount implements Account {
    getCashFlows(transfer: Transfer[], months: number) {
        return [];
    }
}

export class CashAccount implements Account {

    startAmount: number;
    totalIncome: number;

    constructor(start: number, totalIncome: number) {
        this.startAmount = start;
        this.totalIncome = totalIncome;
    }

    getCashFlows(transfer: Transfer[], months: number) {

        let cashFlowsOut = [];

        let prevBalance = this.startAmount;

        for (let i = 0; i < months; i++) {
            let curBalance = prevBalance + this.totalIncome;
            cashFlowsOut.push(new CashCashFlow(curBalance, this.totalIncome));
        }

        return cashFlowsOut;
    }

}

export interface CashFlow {
    balance: number;
}

export class CashCashFlow implements CashFlow {
    balance: number;
    net: number;

    constructor(balance: number, net: number) {
        this.balance = balance;
        this.net = net;
    }

}

export interface Transfer {
    fromAccount: number;
    toAccount: number;
    amount: number;
}