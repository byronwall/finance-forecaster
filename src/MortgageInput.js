import React, { Component } from "react";
import { FormGroup, FormControl } from "react-bootstrap";

export default class MortgageInput extends Component {

    handleChange(e, key) {

        let amount = Number.parseFloat(e.target.value)
        amount = Number.isNaN(amount) ? 0 : amount;

        //this is using wacky ES6 syntax to simplify the object creation
        this.props.handleChange({
            id: this.props.id,
            [key]: amount,
            key
        })
    }

    render() {

        let input = this.props.input;

        return (
            <tr>
                <td>
                    <FormGroup controlId="formBasicText">
                        <FormControl
                            type="text"
                            value={input.amount}
                            placeholder="Starting amount"
                            onChange={(e) => { this.handleChange(e, "amount") }}
                        />
                    </FormGroup>
                </td>
                <td>
                    <FormGroup controlId="formBasicText">
                        <FormControl
                            type="text"
                            value={input.rate}
                            placeholder="Rate"
                            onChange={(e) => { this.handleChange(e, "rate") }}
                        />
                    </FormGroup>
                </td>
                <td>
                    <FormGroup controlId="formBasicText">
                        <FormControl
                            type="text"
                            value={input.term}
                            placeholder="Term"
                            onChange={(e) => { this.handleChange(e, "term") }}
                        />
                    </FormGroup>
                </td>

                <td>
                    <FormGroup controlId="formBasicText">
                        <FormControl
                            type="text"
                            value={input.delay}
                            placeholder="Term"
                            onChange={(e) => { this.handleChange(e, "delay") }}
                        />
                    </FormGroup>
                </td>
            </tr>
        );
    }
}
