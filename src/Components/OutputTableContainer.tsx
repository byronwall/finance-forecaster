import * as React from "react";
import { Component } from "react";
import { Panel, Col } from "react-bootstrap";
import { AccountList } from "./AccountList";

import { LoanAccount, AccountTypes } from "../Models/Account";

import { LoanOutputTable } from "./LoanOutputTable";
import { CombinedOutputTable } from "./CombinedOutputTable";

interface OutputTableContainerProps {
  accounts: LoanAccount[];
  handleAccountChange(obj: LoanAccount, shouldRemove?: boolean): void;
}

interface OutputTableContainerState {
  activeAccount: number;
}

export class OutputTableContainer extends Component<
  OutputTableContainerProps,
  OutputTableContainerState
> {
  constructor(props: OutputTableContainerProps) {
    super(props);

    this.state = {
      activeAccount: 0
    };

    this.handleInternalChange = this.handleInternalChange.bind(this);
  }

  handleInternalChange(newActive: number) {
    this.setState({
      activeAccount: newActive
    });
  }

  getAccountTable(account: LoanAccount) {
    if (this.state.activeAccount === -1) {
      return <CombinedOutputTable accounts={this.props.accounts} />;
    }

    switch (account.type) {
      case AccountTypes.Loan:
      case AccountTypes.Cash:
        return (
          <LoanOutputTable
            account={account as LoanAccount}
            handleAccountChange={this.props.handleAccountChange}
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
    )!;

    console.log("active account", activeAccount);

    return (
      <div>
        <Panel header="Output">
          <Col md={3}>
            <AccountList
              accounts={this.props.accounts}
              activeAccount={this.state.activeAccount}
              handleChange={this.handleInternalChange}
              handleAccountChange={this.props.handleAccountChange}
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
