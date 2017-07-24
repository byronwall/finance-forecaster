import * as React from "react";
import { Component } from "react";
import { Panel, Col } from "react-bootstrap";
import { AccountList } from "./AccountList";

import { LoanAccount, AccountTypes, Transfer } from "../Models/Account";

import { LoanOutputTable } from "./LoanOutputTable";
import { CombinedOutputTable } from "./CombinedOutputTable";
import {} from "./TransferGroup";

interface OutputTableContainerProps {
  accounts: LoanAccount[];
  transfers: Transfer[];
  handleAccountChange(obj: LoanAccount, shouldRemove?: boolean): void;
  handleTransferChange(obj: Transfer, shouldRemove?: boolean): void;
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
      activeAccount: -1
    };

    this.handleInternalChange = this.handleInternalChange.bind(this);
  }

  handleInternalChange(newActive: number) {
    console.log("new active", newActive);
    this.setState({
      activeAccount: newActive
    });
  }

  componentWillUpdate() {
    let wasFound = false;
    let maxId = -1;
    this.props.accounts.forEach(account => {
      if (account.id === this.state.activeAccount) {
        wasFound = true;
      } else {
        maxId = account.id;
      }
    });

    if (!wasFound) {
      this.setState({ activeAccount: maxId });
    }
  }

  getAccountTable(account: LoanAccount) {
    if (this.state.activeAccount === -1) {
      return <CombinedOutputTable accounts={this.props.accounts} />;
    }

    if (account === undefined) {
      return <div />;
    }

    switch (account.type) {
      case AccountTypes.Loan:
      case AccountTypes.Cash:
        return (
          <LoanOutputTable
            account={account as LoanAccount}
            handleAccountChange={this.props.handleAccountChange}
            handleTransferChange={this.props.handleTransferChange}
            accounts={this.props.accounts}
          />
        );
      default:
        return <div />;
    }
  }

  render() {
    let activeAccount = this.props.accounts.find(
      account => account.id === this.state.activeAccount
    )!;

    const accountTable = this.getAccountTable(activeAccount);

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
            {accountTable}
          </Col>
        </Panel>
      </div>
    );
  }
}
