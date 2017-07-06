import React, { Component } from "react";
import { Panel, FormGroup, ControlLabel, FormControl } from "react-bootstrap";

//this will support an amount and frequency

//will add support for start time to delay event

export default class RecurringInput extends Component {
    constructor(props) {
        super(props);

        //this is required in order to use this correct in the event handler
        this.handleAmount = this.handleAmount.bind(this);
        this.handleFreq = this.handleFreq.bind(this);
        this.handleDelay = this.handleDelay.bind(this);
    }

    handleAmount(e) {

        let amount = Number.parseFloat(e.target.value)
        amount = Number.isNaN(amount) ? 0 : amount;

        this.props.handleChange({
            id: this.props.id,
            amount: amount,
            key: "amount"
        })
    }
    handleFreq(e) {

        let amount = Number.parseFloat(e.target.value)
        amount = Number.isNaN(amount) ? 0 : amount;

        this.props.handleChange({
            id: this.props.id,
            frequency: amount,
            key: "frequency"
        })
    }

    handleDelay(e) {

        let amount = Number.parseFloat(e.target.value)
        amount = Number.isNaN(amount) ? 0 : amount;

        this.props.handleChange({
            id: this.props.id,
            delay: amount,
            key: "delay"
        })
    }

    render() {
        let inputData = this.props.input;

        return (
            <tr>

                <td>
                    <input type="text"
                        value={inputData.amount}
                        placeholder="Starting amount"
                        onChange={this.handleAmount}
                    />
                </td>

                <td>
                    <input
                        type="text"
                        value={inputData.frequency}
                        placeholder="Rate"
                        onChange={this.handleFreq}
                    />
                </td>
                <td>
                    <input
                        type="text"
                        value={inputData.delay}
                        placeholder="Delay"
                        onChange={this.handleDelay}
                    />
                </td>
            </tr>
        );
    }
}
