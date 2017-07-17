import * as React from "react";
import { Component } from "react";
import { Panel, Col } from "react-bootstrap";
import OutputTableHeader from "./OutputTableHeader";

import { Account, CashAccount, LoanAccount } from "../Models/Account";
import { CashOutputTable } from "./CashOutputTable";
import { LoanOutputTable } from "./LoanOutputTable";
import { CombinedOutputTable } from "./CombinedOutputTable";

interface OutputTableContainerProps {
  accounts: Account[];
  handleAccountChange: (
    obj: any,
    index: number,
    shouldRemove?: boolean
  ) => void;
}

interface OutputTableContainerState {
  activeAccount: number;
}

export default class OutputTableContainer extends Component<
  OutputTableContainerProps,
  OutputTableContainerState
> {
  constructor(props: OutputTableContainerProps) {
    super(props);

    this.state = {
      activeAccount: 0
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(newActive: number) {
    this.setState({
      activeAccount: newActive
    });
  }

  handleNewAccount(acctType: string) {
    // add the account

    let newAccount;
    if (acctType === "cash") {
      newAccount = new CashAccount();
    } else if (acctType === "loan") {
      newAccount = new LoanAccount();
    }

    const currentLength = this.props.accounts.length;

    this.props.handleAccountChange(newAccount, -1);

    this.setState({ activeAccount: currentLength });

    // make it active
  }

  handleRemoveAccount(index: number) {
    if (
      this.state.activeAccount === index ||
      this.state.activeAccount === this.props.accounts.length - 1
    ) {
      this.setState({ activeAccount: 0 });
    }
    this.props.handleAccountChange(null, index, true);
  }

  getAccountTable(account: Account) {
    if (this.state.activeAccount === -1) {
      return <CombinedOutputTable accounts={this.props.accounts} />;
    }

    switch (account.type) {
      case "cash":
        return (
          <CashOutputTable
            account={account as CashAccount}
            handleAccountChange={this.props.handleAccountChange}
            index={this.state.activeAccount}
            accounts={this.props.accounts}
          />
        );
      case "loan":
        return (
          <LoanOutputTable
            account={account as LoanAccount}
            handleAccountChange={this.props.handleAccountChange}
            index={this.state.activeAccount}
            accounts={this.props.accounts}
          />
        );
      default:
        return <div />;
    }
  }

  render() {
    let activeAccount = this.props.accounts.find(
      (account, index) => index === this.state.activeAccount
    ) as CashAccount;

    console.log("active account", activeAccount);

    return (
      <div>
        <Panel header="Output">
          <Col md={3}>
            <OutputTableHeader
              accounts={this.props.accounts}
              activeAccount={this.state.activeAccount}
              handleChange={this.handleChange}
              handleNewAccount={(type: string) => this.handleNewAccount(type)}
              handleRemoveAccount={(index: number) =>
                this.handleRemoveAccount(index)}
            />
          </Col>
          <Col md={9}>
            {this.getAccountTable(activeAccount)}
          </Col>
        </Panel>
      </div>
    );
  }
}
