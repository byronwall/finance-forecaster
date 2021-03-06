import * as React from "react";
import { Component } from "react";

import { LoanAccount } from "../Models/Account";
import {
  ListGroup,
  ListGroupItem,
  Button,
  Glyphicon,
  ButtonGroup
} from "react-bootstrap";

interface OutputTableHeaderProps {
  accounts: LoanAccount[];
  activeAccount: number;
  handleChange(newActive: number): void;
  handleAccountChange(obj: LoanAccount, shouldRemove?: boolean): void;
}

export class AccountList extends Component<OutputTableHeaderProps> {
  render() {
    const accounts = this.props.accounts.filter(account => account.id >= 0);

    return (
      <div>
        <h2>accounts</h2>
        <div>
          <ButtonGroup>
            <Button
              onClick={() => this.props.handleAccountChange(new LoanAccount())}
            >
              <Glyphicon glyph="plus" /> {"account"}
            </Button>
          </ButtonGroup>
        </div>

        <ListGroup>
          {accounts.map(account =>
            <ListGroupItem
              key={account.id}
              active={account.id === this.props.activeAccount}
              onClick={() => this.props.handleChange(account.id)}
            >
              {account.name}

              <Button
                onClick={e => {
                  this.props.handleAccountChange(account, true);
                  e.stopPropagation();
                }}
                bsSize="sm"
                className="pull-right"
                bsStyle="danger"
              >
                <Glyphicon glyph="remove" />
              </Button>
            </ListGroupItem>
          )}

          <ListGroupItem
            key={-1}
            active={-1 === this.props.activeAccount}
            onClick={() => this.props.handleChange(-1)}
          >
            {"combined output"}
          </ListGroupItem>
        </ListGroup>
      </div>
    );
  }
}
