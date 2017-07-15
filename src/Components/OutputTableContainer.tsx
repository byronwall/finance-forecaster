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
  handleAccountChange: (obj: any, index: number) => void;
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
          />
        );
      case "loan":
        return (
          <LoanOutputTable
            account={account as LoanAccount}
            handleAccountChange={this.props.handleAccountChange}
            index={this.state.activeAccount}
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
