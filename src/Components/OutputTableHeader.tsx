import * as React from "react";
import { Component } from "react";

import * as Bootstrap from "react-bootstrap";

import { Account } from "../Models/Account";

interface OutputTableHeaderProps {
    accounts: Account[];
    activeAccount: number;
    handleChange: (newAcive: number) => void;
}

export default class OutputTableHeader extends Component<OutputTableHeaderProps, any> {
    render() {
        return (
            <div>
                <h2>accounts</h2>

                <Bootstrap.ListGroup>
                    {this.props.accounts.map((account, index) => (
                        <Bootstrap.ListGroupItem
                            key={index}
                            active={index === this.props.activeAccount}
                            onClick={() => this.props.handleChange(index)}
                        >
                            {account.name}
                        </Bootstrap.ListGroupItem>
                    ))}
                </Bootstrap.ListGroup>
            </div>
        );
    }
}
