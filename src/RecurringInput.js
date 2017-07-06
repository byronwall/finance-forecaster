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
    }

    handleAmount(e) {
        this.props.handleChange({
            id: this.props.id,
            amount: Number.parseFloat(e.target.value),
            key: "amount"
        })
    }
    handleFreq(e) {
        this.props.handleChange({
            id: this.props.id,
            frequency: Number.parseFloat(e.target.value),
            key: "frequency"
        })
    }

    render() {
        let inputData = this.props.input;

        return (
            <div>
                <Panel header="Mortgage Input">
                    <form>
                        <FormGroup controlId="formBasicText">
                            <ControlLabel>Enter amount</ControlLabel>
                            <FormControl
                                type="text"
                                value={inputData.amount}
                                placeholder="Starting amount"
                                onChange={this.handleAmount}

                            />

                        </FormGroup>
                        <FormGroup controlId="formBasicText">
                            <ControlLabel>Enter frequency</ControlLabel>
                            <FormControl
                                type="text"
                                value={inputData.frequency}
                                placeholder="Rate"
                                onChange={this.handleFreq}

                            />

                        </FormGroup>
                    </form>
                </Panel>
            </div>
        );
    }
}
