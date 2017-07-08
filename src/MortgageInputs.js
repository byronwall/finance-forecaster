import React, { Component } from "react";
import { Panel } from "react-bootstrap";

import MortgageInput from "./MortgageInput";

//props will be an array of recurring input types

//this will hold all of the recurring inputs

export default class MortgageInputs extends Component {
    constructor(props) {
        super(props);

        //this is required in order to use this correct in the event handler
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(obj) {
        //this will just pass the event through
        this.props.handleChange(obj)
    }

    render() {

        let inputs = this.props.inputs;

        return (
            <div>
                <Panel header="Loan Inputs">
                    <form>
                        <table>
                            <thead>
                                <tr>
                                    <th>principal</th>
                                    <th>yearly rate</th>
                                    <th>term</th>
                                    <th>delay</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    inputs.map((inputData, index) => (
                                        <MortgageInput
                                            input={inputData}
                                            key={index} id={index}
                                            handleChange={this.handleChange} />
                                    ))
                                }
                            </tbody>
                        </table>
                    </form>
                </Panel>
            </div>
        );
    }
}
