export interface Account {
    getCashFlows: (months: number, transfer: Transfer[]) => CashFlow[];
    type: string;
    name: string;
}

export class LoanAccount implements Account {

    type = "loan";
    name = "testing";

    getCashFlows(months: number, transfer: Transfer[] = []) {
        return [];
    }
}

export class CashAccount implements Account {

    startAmount: number;
    totalIncome: number;

    type = "cash";
    name = "testing";

    constructor(start: number, totalIncome: number) {
        this.startAmount = start;
        this.totalIncome = totalIncome;
    }

    getCashFlows(months: number, transfer: Transfer[]) {

        let cashFlowsOut = [];

        let prevBalance = this.startAmount;

        for (let i = 0; i < months; i++) {
            let curBalance = prevBalance + this.totalIncome;
            cashFlowsOut.push(new CashCashFlow(curBalance, this.totalIncome, i));
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

    constructor(balance: number, net: number, month: number) {
        this.balance = balance;
        this.net = net;
        this.month = month;
    }

}

export interface Transfer {
    fromAccount: number;
    toAccount: number;
    amount: number;
}