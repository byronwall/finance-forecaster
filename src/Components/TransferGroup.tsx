import * as React from "react";
import { Component } from "react";
import { Table, FormControl, Button, Glyphicon } from "react-bootstrap";

import { Transfer, LoanAccount } from "../Models/Account";
import { $N, handleInput } from "../Helpers/Functions";

interface TransferGroupProps {
  transfers: Transfer[];
  accounts: LoanAccount[];
  handleNewTransfer: (obj: Transfer) => void;
}

interface TransferGroupState {
  newTransfer: Transfer;
}

export class TransferGroup extends Component<
  TransferGroupProps,
  TransferGroupState
> {
  constructor(props: TransferGroupProps) {
    super(props);

    this.state = {
      newTransfer: new Transfer()
    };
  }

  handleNewTransferEdit(data: any) {
    let newState = new Transfer();
    newState = { ...newState, ...this.state.newTransfer, ...data };

    this.setState({ newTransfer: newState });
  }

  handleNewTransfer() {
    let newState = new Transfer();
    newState = { ...newState, ...this.state.newTransfer };

    this.props.handleNewTransfer(newState);

    this.setState({ newTransfer: new Transfer() });
  }

  handleTransferAccount(direction: "to" | "from", id: number) {
    let newState = new Transfer();
    Object.assign(newState, this.state.newTransfer);

    // TODO: determine why a === does not work here
    let matchingAccount = this.props.accounts.find(
      account => account.id == id
    )!;

    if (direction === "to") {
      newState.toAccount = matchingAccount;
    } else if (direction === "from") {
      newState.fromAccount = matchingAccount;
    }

    console.log(
      "new xfer obj",
      newState,
      "accounts",
      this.props.accounts,
      "id",
      id,
      "match",
      matchingAccount
    );

    this.setState({ newTransfer: newState });
  }

  render() {
    let transfers = this.props.transfers;

    let columns = ["amount", "frequency", "start", "end"];

    return (
      <div>
        <h3>transfers</h3>
        <form>
          <Table>
            <thead>
              <tr>
                {columns.map((column, index) =>
                  <th key={index}>
                    {column}
                  </th>
                )}
                <th>to account</th>
                <th>from account</th>
                <th />
              </tr>
            </thead>

            <tbody>
              {transfers.map((transfer, index1) =>
                <tr key={index1}>
                  {columns.map((column, index2) =>
                    <td key={index2}>
                      {transfer[column]}
                    </td>
                  )}

                  <td>
                    {transfer.toAccount.name}
                  </td>
                  <td>
                    {transfer.fromAccount.name}
                  </td>
                </tr>
              )}

              <tr>
                {columns.map((column, index) =>
                  <td key={index}>
                    <FormControl
                      type="text"
                      value={$N(this.state.newTransfer[column], "")}
                      placeholder={column}
                      onChange={(e: any) =>
                        this.handleNewTransferEdit({
                          [column]: handleInput(e.target.value)
                        })}
                    />
                  </td>
                )}
                <td>
                  <FormControl
                    componentClass="select"
                    onChange={(e: any) =>
                      this.handleTransferAccount("to", e.target.value)}
                  >
                    {this.props.accounts.map(account =>
                      <option key={account.id} value={account.id}>
                        {account.name}
                      </option>
                    )}
                  </FormControl>
                </td>

                <td>
                  <FormControl
                    componentClass="select"
                    onChange={(e: any) =>
                      this.handleTransferAccount("from", e.target.value)}
                  >
                    {this.props.accounts.map(account =>
                      <option key={account.id} value={account.id}>
                        {account.name}
                      </option>
                    )}
                  </FormControl>
                </td>

                <td>
                  <Button
                    onClick={() => this.handleNewTransfer()}
                    bsSize="small"
                  >
                    <Glyphicon glyph="plus" />
                  </Button>
                </td>
              </tr>
            </tbody>
          </Table>
        </form>
      </div>
    );
  }
}
