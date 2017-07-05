import React, { Component } from "react";
import { Panel, FormGroup, ControlLabel, FormControl } from "react-bootstrap";

export default class Inputs extends Component {
    constructor(props) {
        super(props);

        //this is required in order to use this correct in the event handler
        this.handleRate = this.handleRate.bind(this);
        this.handleTerm = this.handleTerm.bind(this);
        this.handleStart = this.handleStart.bind(this);
    }

    handleTerm(e) {
        this.props.handleChange({ term: e.target.value })
    }
    handleRate(e) {
        this.props.handleChange({ rate: e.target.value })
    }
    handleStart(e) {
        this.props.handleChange({ start: e.target.value })
    }

    render() {
        return (
            <div>
                <Panel header="Mortgage Input">
                    <form>
                        <FormGroup controlId="formBasicText">
                            <ControlLabel>Enter starting amount</ControlLabel>
                            <FormControl
                                type="text"
                                value={this.props.mortgageObj.start}
                                placeholder="Starting amount"
                                onChange={this.handleStart}
                            />

                        </FormGroup>
                        <FormGroup controlId="formBasicText">
                            <ControlLabel>Enter yearly rate</ControlLabel>
                            <FormControl
                                type="text"
                                value={this.props.mortgageObj.rate}
                                placeholder="Rate"
                                onChange={this.handleRate}
                            />

                        </FormGroup>
                        <FormGroup controlId="formBasicText">
                            <ControlLabel>Enter a term (years)</ControlLabel>
                            <FormControl
                                type="text"
                                value={this.props.mortgageObj.term}
                                placeholder="Term"
                                onChange={this.handleTerm}
                            />

                        </FormGroup>
                    </form>
                </Panel>
            </div>
        );
    }
}
