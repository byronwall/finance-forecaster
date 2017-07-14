import * as React from "react";
import { Component } from "react";
import { Panel, Col } from "react-bootstrap";
import OutputTableHeader from "./OutputTableHeader";

import { Account, CashAccount } from "../Models/Account";
import { CashOutputTable } from "./OutputTable";

interface OutputTableContainerProps {
    accounts: Account[];
    handleAccountChange: (obj: any, index: number) => void;
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

        let activeAccount = this.props.accounts.find((account, index) =>
            index === this.state.activeAccount) as CashAccount;

        console.log("active account", activeAccount)

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
                        <CashOutputTable
                            account={activeAccount}
                            cashFlow={activeAccount.getCashFlows(24, [])}
                            handleAccountChange={this.props.handleAccountChange}
                            index={this.state.activeAccount}
                        />
                    </Col>
                </Panel>
            </div>
        );
    }
}
