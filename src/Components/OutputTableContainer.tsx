import * as React from "react";
import { Component } from "react";
import { Panel, Col } from "react-bootstrap";
import OutputTableHeader from "./OutputTableHeader";

import { Account } from "../Models/Account";
import OutputTable from "./OutputTable";

interface OutputTableContainerProps {
    accounts: Account[];
}

interface OutputTableContainerState {
    activeAccount: number;
}

export default class OutputTableContainer extends Component<OutputTableContainerProps, OutputTableContainerState> {
    constructor(props: OutputTableContainerProps) {
        super(props);

        this.state = {
            activeAccount: 0
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(newActive: number) {
        this.setState({
            activeAccount: newActive
        });
    }

    render() {
        return (
            <div>
                <Panel header="Output">
                    <Col md={5}>
                        <OutputTableHeader
                            accounts={this.props.accounts}
                            activeAccount={this.state.activeAccount}
                            handleChange={this.handleChange}
                        />
                    </Col>
                    <Col md={7}>
                        <OutputTable
                            accounts={this.props.accounts}
                            activeAccount={this.state.activeAccount}
                        />
                    </Col>
                </Panel>
            </div>
        );
    }
}
