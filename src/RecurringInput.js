import React, { Component } from "react";
import { FormGroup, Glyphicon, FormControl } from "react-bootstrap";

export default class RecurringInput extends Component {

    handleChange(e, key) {
        console.log("recurring input", e, key);

        let amount = Number.parseFloat(e.target.value)
        amount = Number.isNaN(amount) ? 0 : amount;

        this.props.handleChange({
            id: this.props.id,
            [key]: amount,
            key
        })
    }

    render() {
        let inputData = this.props.input;

        return (
            <tr>
                <td>
                    <FormGroup>
                        <FormControl
                            type="text"
                            value={inputData.amount}
                            placeholder="Starting amount"
                            onChange={(e) => { this.handleChange(e, "amount") }}
                        />
                    </FormGroup>
                </td>

                <td>
                    <FormGroup>
                        <FormControl
                            type="text"
                            value={inputData.frequency}
                            placeholder="Rate"
                            onChange={(e) => { this.handleChange(e, "frequency") }}
                        />
                    </FormGroup>
                </td>
                <td>
                    <FormGroup>
                        <FormControl
                            type="text"
                            value={inputData.delay}
                            placeholder="Delay"
                            onChange={(e) => { this.handleChange(e, "delay") }}
                        />
                    </FormGroup>
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
