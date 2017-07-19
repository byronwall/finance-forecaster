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
  handleChange: (newAcive: number) => void;
  handleNewAccount: (type: string) => void;
  handleRemoveAccount: (index: number) => void;
}

export class AccountList extends Component<OutputTableHeaderProps> {
  render() {
    return (
      <div>
        <h2>accounts</h2>
        <div>
          <ButtonGroup>
            <Button onClick={() => this.props.handleNewAccount("cash")}>
              <Glyphicon glyph="plus" /> {"cash"}
            </Button>
            <Button onClick={() => this.props.handleNewAccount("loan")}>
              <Glyphicon glyph="plus" /> {"loan"}
            </Button>
          </ButtonGroup>
        </div>

        <ListGroup>
          {this.props.accounts.map((account, index) =>
            <ListGroupItem
              key={index}
              active={index === this.props.activeAccount}
              onClick={() => this.props.handleChange(index)}
            >
              {account.name}

              <Button
                onClick={e => {
                  this.props.handleRemoveAccount(index);
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
