import * as React from "react";
import { Component } from "react";
import { FormGroup, Glyphicon, FormControl } from "react-bootstrap";
import { CashAccount } from "../Models/Account";

interface RecurringProp {
    input: CashAccount;
    id: number;
    handleChange: (obj: {}) => void;
}

export default class RecurringInput extends Component<RecurringProp, {}> {

    handleChange(e: React.FormEvent<any>, key: string) {
        console.log("recurring input", e, key);

        let target = e.target as HTMLInputElement;

        let amount = Number.parseFloat(target.value);
        amount = Number.isNaN(amount) ? 0 : amount;

        this.props.handleChange({
            id: this.props.id,
            [key]: amount,
            key
        });
    }

    render() {
        let inputData = this.props.input;

        return (
            <tr>
                <td>
                    <FormGroup>
                        <FormControl
                            type="text"
                            value={inputData.startAmount}
                            placeholder="Starting amount"
                            onChange={(e) => this.handleChange(e, "amount")}
                        />
                    </FormGroup>
                </td>

                <td>
                    {/* <FormGroup>
                        <FormControl
                            type="text"
                            value={inputData.frequency}
                            placeholder="Rate"
                            onChange={(e) => this.handleChange(e, "frequency")}
                        />
                    </FormGroup> */}
                </td>
                <td>
                    {/* <FormGroup>
                        <FormControl
                            type="text"
                            value={inputData.delay}
                            placeholder="Delay"
                            onChange={(e) => this.handleChange(e, "delay")}
                        />
                    </FormGroup> */}
                </td>

                <td>
                    <div onClick={(e) => this.handleChange(e, "remove")}>
                        <Glyphicon glyph="remove" />
                    </div>
                </td>
            </tr>
        );
    }
}
