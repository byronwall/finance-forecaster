import * as React from "react";
import { Component } from "react";
import { Table, FormControl, Button, Glyphicon } from "react-bootstrap";

import { Transfer, LoanAccount } from "../Models/Account";
import { $N, handleInput } from "../Helpers/Functions";
import { ClickEditable } from "./ClickEditable";

interface TransferGroupProps {
  account?: LoanAccount;
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

    // get a fresh blank transfer
    const xfer = this._getNewXfer();

    this.state = {
      newTransfer: xfer
    };
  }

  _getNewXfer() {
    const xfer = new Transfer();
    xfer.toAccount = this.props.accounts.find(account => account.id === -1)!;
    xfer.fromAccount = xfer.toAccount;

    return xfer;
  }

  handleNewTransferEdit(data: any) {
    let newState = new Transfer();
    newState = { ...newState, ...this.state.newTransfer, ...data };

    this.setState({ newTransfer: newState });
  }

  handleNewTransfer() {
    let newState = new Transfer();
    newState = { ...newState, ...this.state.newTransfer };

    // do a check here to see if the accounts have at least one for the associated one
    let isValid = true;
    if (this.props.account !== undefined) {
      isValid =
        this.props.account.id === newState.fromAccount.id ||
        this.props.account.id === newState.toAccount.id;
    }

    if (isValid) {
      this.props.handleNewTransfer(newState);

      this.setState({ newTransfer: this._getNewXfer() });
    } else {
      alert("one side of the xfer must include current account");
    }
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

    this.setState({ newTransfer: newState });
  }

  render() {
    let transfers = this.props.transfers;

    let columns = ["amount", "frequency", "start", "end"];

    const accounts = this.props.accounts.sort((a, b) => a.id - b.id);
    const toAccount =
      this.state.newTransfer.toAccount !== undefined
        ? this.state.newTransfer.toAccount.id
        : -1;

    const fromAccount =
      this.state.newTransfer.fromAccount !== undefined
        ? this.state.newTransfer.fromAccount.id
        : -1;

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
                      <ClickEditable
                        value={transfer[column]}
                        handleValueChange={value => alert(value)}
                      />
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
                    value={toAccount}
                    onChange={(e: any) =>
                      this.handleTransferAccount("to", +e.target.value)}
                  >
                    {accounts.map(account =>
                      <option key={account.id} value={account.id}>
                        {account.name}
                      </option>
                    )}
                  </FormControl>
                </td>

                <td>
                  <FormControl
                    componentClass="select"
                    value={fromAccount}
                    onChange={(e: any) =>
                      this.handleTransferAccount("from", +e.target.value)}
                  >
                    {accounts.map(account =>
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
