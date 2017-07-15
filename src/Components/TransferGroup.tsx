import * as React from "react";
import { Component } from "react";
import { Table, FormControl, Button } from "react-bootstrap";

import { Transfer } from "../Models/Account";
import { $N, handleInput } from "../Helpers/Functions";

interface TransferGroupProps {
  transfers: Transfer[];
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
    let newState = { ...this.state.newTransfer };

    for (let key of Object.keys(data)) {
      newState[key] = data[key];
    }

    this.setState({ newTransfer: newState });
  }

  handleNewTransfer() {
    let newObj = { ...this.state.newTransfer };

    this.props.handleNewTransfer(newObj);

    this.setState({ newTransfer: new Transfer() });
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
                  <Button onClick={() => this.handleNewTransfer()}>
                    {"add new"}
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
